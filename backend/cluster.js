// Runs one backend worker per CPU core on this machine (the OS spreads incoming
// connections across them). Use `npm run start:cluster`. Needs REDIS_URL so the
// workers share Socket.IO rooms and rate-limit counters.
const cluster = require('cluster');
const os = require('os');

const WORKERS = parseInt(process.env.WEB_CONCURRENCY, 10) || os.cpus().length;

if (cluster.isPrimary) {
    if (!process.env.REDIS_URL) {
        console.log('Warning: REDIS_URL is not set; real-time events will only reach users on the same worker.');
    }
    console.log(`Primary ${process.pid} starting ${WORKERS} workers`);
    for (let i = 0; i < WORKERS; i++) cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited (${signal || code}), restarting`);
        cluster.fork();
    });
} else {
    require('./index');
}
