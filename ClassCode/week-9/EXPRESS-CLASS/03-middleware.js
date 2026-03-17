const express = require("express");

function block_1_httpMethods() {
    return new Promise((resolve) => {
        const app = express();
        const logs = [];
        app.use(express.json());

        //request logger 

        app.use((req, res) => {
            //add to database
            //console log everything
            // write in some file

            const logEntry = `${req.method} : ${req.url}`
            logs.push(logEntry)
            console.log(`[LOG] -- ${logEntry}`); // khud ka wingstron (log in production)

            //if your request hangs forever then you fogot to write next()

            next()
        })

        app.use((req, res, next) => {
            req.startTime = Date.now()

            res.on('finish', () => {
                const duration = Date.now() - req.startTime;
                console.log(`[TIMER] - ${req.method} - ${req.url} took ${duration}ms`);

            })

            next()
        })

        function authMe(req, res, next) {
            const token = req.headers['x-auth-token']

            if (!token) {
                return res.status(401).json({ error: "No Token , please login" })
            }

            if (token !== 'secret-chaicode') {
                return res.status(403).json({ error: "Invalid token" })
            }

            req.user = { id: 1, name: "Prakash", role: "admin" }
        }

        function getRole(role) {
            return (req, res, next) => {
                if (!req.user || req.user !== role) {
                    return res.status(403).json({ error: `Role ${role} required` })
                }
                next();
            }
        }

        function rateLimit(maxRequest) {
            let count = 0

            return (req, res, next) => {
                count++;
                if (count > maxRequest) {
                    return res.status(429).json({ error: "Too many request, please try after some time !" })
                }
                next()
            }
        }

        const limitedEndPoint = rateLimit(3)

        app.get('/limited', limitedEndPoint, (req, res) => { })

        app.get('/profile', authMe, getRole('admin') => {})
        app.get('/profile', authMe, getRole('admin') => {})
        app.get('/profile', authMe, getRole('admin') => {})

        app.get('/profile', authMe, getRole(['admin']) => {})
        app.get('/profile', authMe, getRole(['admin', 'teacher', 'student']) => {})



        const server = app.listen(0, async () => {
            const port = server.address().port
            const base = `http://127.0.0.1: ${port}`;

            try {
                //TODO
                const listRes = await fetch(`${base}/routes`)
                const listData = await listRes.json()

                const createRes = await fetch(`${base}/routes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                        body: JSON.stringify({
                            name: "Colaba-Worli",
                            direction: "South"
                        })
                    }
                })
                const created = await createRes.json()

            } catch (error) {
                console.log(error);

            }
            server.close(() => {
                console.log("Block 1 served...");
                resolve()

            })
        })
    })
}

function block_2_httpMethods() {
    return new Promise((resolve) => {
        const app = express()
        app.use(express.json())

        app.get('/files/*filepath', (req, res) => {
            const filepath = req.params.filepath
            res.json({ filepath, type: "wildcard" })
        })

        app
            .route("/schedule")
            .get((req, res) => { })
            .post((req, res) => { })
            .put((req, res) => { })
            .delete((req, res) => { })


        app.use("/api", (req, res) => {
            //its a prefetch match

        })


        const server = app.listen(0, async () => {
            const port = server.address().port
            const base = `http://127.0.0.1: ${port}`;

            try {
                //TODO:
            } catch (error) {
                console.log(error);

            }
        })
    })
}

async function main() {
    await block_1_basicServer()
    await block_2_response()

    process.exit(0)
}
main()