import test from 'ava';
import express from 'express';
import request from 'supertest';
import rebindHost from './';

/**
 * @param   {Function} [modify] function to modify the application
 * @returns {Function}          express application
 */
const createApp = (modify) => {
    modify = modify || (app => app);
    
    return modify(express())
        .get('/', (req, res) => {
            res.json({ host: req.host });
        });
}



test.cb('use header "Host" which contains hostname', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .use(rebindHost());
    });

    request(app)
        .get('/')
        .set('Host', 'localhost')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost');
            t.end();
        });
});

test.cb('use header "Host" which contains hostname and port', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .use(rebindHost());
    });

    request(app)
        .get('/')
        .set('Host', 'localhost:3000')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost:3000');
            t.end();
        });
});

test.cb('use header "X-Forwarded-Host" which contains hostname', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .set('trust proxy', true)
            .use(rebindHost());
    });

    request(app)
        .get('/')
        .set('X-Forwarded-Host', 'localhost')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost');
            t.end();
        });
});

test.cb('use header "X-Forwarded-Host" which contains hostname and port', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .set('trust proxy', true)
            .use(rebindHost());
    });

    request(app)
        .get('/')
        .set('X-Forwarded-Host', 'localhost:3000')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost:3000');
            t.end();
        });
});

test.cb('use header "X-Forwarded-Host" instead of "Host"', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .set('trust proxy', true)
            .use(rebindHost());
    });

    request(app)
        .get('/')
        .set('Host', 'localhost:3000')
        .set('X-Forwarded-Host', 'localhost')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost');
            t.end();
        });
});

test.cb('use forced host instead of headers', t => {
    t.plan(2);

    const app = createApp((app) => {
        return app
            .use(rebindHost('localhost'));
    });

    request(app)
        .get('/')
        .set('Host', 'localhost:3000')
        .expect(200)
        .end((err, res) => {
            t.falsy(err);
            t.is(res.body.host, 'localhost');
            t.end();
        });
});