const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8022;
const corsOptions = {
    origin: 'http://localhost:8019',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Megagram',
    password: 'WINwin1$',
});

app.get('/getAllNotificationsOfUser/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const pgsqlQuery = "SELECT * FROM user_notifications WHERE recipient = $1";
        const results = await pool.query(pgsqlQuery, [username]);
        res.send(results.rows);
    }
    catch (error) {
        console.error('Error querying PostgresSQL:', error);
        res.status(500).json({ error: error});
    }
});

app.post('/addNotification', async (req, res) => {
    try {
        const recipient = req.body.recipient;
        const subject = req.body.subject;
        const action = req.body.action;

        const pgsqlMutation = `
        INSERT INTO user_notifications (recipient, subject, action, isread)
        VALUES ($1, $2, $3, false)
        `;

        await pool.query(pgsqlMutation, [recipient, subject, action]);
        res.send({wasOperationSuccessful: true});
    } catch (error) {
        console.error('Error querying PostgresSQL:', error);
        res.status(500).json({ error: error});
    }
});

app.patch('/markNotificationAsRead', async (req, res) => {
    try {
        const recipient = req.body.recipient;
        const subject = req.body.subject;
        const action = req.body.action;

        const pgsqlMutation = `
        UPDATE user_notifications
        SET isread = true
        WHERE recipient = $1 AND subject = $2 and action = $3
        `;

        await pool.query(pgsqlMutation, [recipient, subject, action]);
        res.send({wasOperationSuccessful: true});
    }
    catch (error) {
        console.error('Error querying PostgresSQL:', error);
        res.status(500).json({ error: error});
    }
});

app.delete('/deleteNotification', async (req, res) => {
    try {
        const recipient = req.body.recipient;
        const subject = req.body.subject;
        const action = req.body.action;

        const pgsqlMutation = `
        DELETE FROM user_notifications
        WHERE recipient = $1 AND subject = $2 and action = $3
        `;

        await pool.query(pgsqlMutation, [recipient, subject, action]);
        res.send({wasOperationSuccessful: true});
    }
    catch (error) {
        console.error('Error querying PostgresSQL:', error);
        res.status(500).json({ error: error});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
});
