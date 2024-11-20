import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// Environment variables
dotenv.config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

// In memory data
let blockedUsers: Map<number, string> = new Map();
let subscribers = new Map<number, string>();


const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

async function getWeather(city: string): Promise<string> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        const weather = data.weather[0].description;
        const temperature = data.main.temp;
        return `The weather in ${city} is ${weather} with a temperature of ${temperature}°C.`;
    } else {
        return 'Our weather service is currently unavailable. Please try again later.';
    }
}

bot.use((ctx, next) => {
    const userId = ctx.from?.id;
    if (userId && blockedUsers.has(userId)) {
        ctx.reply('You are blocked from using the bot.');
    } else {
        next();
    }
});


bot.start((ctx) => {
    ctx.reply('Welcome! Type /subscribe followed by city name to get daily weather updates!\nGet weather updates for a specific city by typing /weather followed by the city name.');
});

bot.use((ctx, next) => {
    console.log(subscribers);
    next();
});


bot.command('subscribe', async (ctx) => {
    const userId = ctx.from?.id;
    const city = ctx.message.text.split(' ')[1];
    if (city && userId) {
        subscribers.set(userId, city);
        ctx.reply(`You are subscribed to daily weather updates for ${city}.`);
        const weather = await getWeather(city);
        bot.telegram.sendMessage(userId, `Daily weather update for ${city}:\n${weather}`);
    } else {
        ctx.reply('Please provide a city name. Example: /subscribe London');
    }
});

bot.command('unsubscribe', (ctx) => {
    const userId = ctx.from?.id;
    if (userId) {
        subscribers.delete(userId);
        ctx.reply('You are unsubscribed from daily weather updates.');
    }
});


bot.command('weather', async (ctx) => {
    const city = ctx.message.text.split(' ')[1];
    if (city) {
        const weather = await getWeather(city);
        ctx.reply(weather);
    } else {
        ctx.reply('Please provide a city name. Example: /weather London');
    }
});

setInterval(() => {
    sendUpdates();
}, 1000 * 60 * 60 * 24);


async function sendUpdates() {
    for (const [userId, city] of subscribers.entries()) {
        const weather = await getWeather(city);
        bot.telegram.sendMessage(userId, `Daily weather update for ${city}:\n${weather}`);
    }
}



// server logic
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));


// login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ username: username }, JWT_SECRET);
        res.status(200).json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});


// middleware to check for token
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
});


// users endpoints to get all users
app.get('/users', (req, res) => {
    res.status(200).json({
        subscribers: Array.from(subscribers),
        blockedUsers: Array.from(blockedUsers)
    })
});



// block, unblock and delete user endpoints ---------------------

app.get('/block/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId) || subscribers.has(userId) === false) {
        res.status(400).send('Invalid user ID');
        return;
    }
    blockedUsers.set(userId, subscribers.get(userId)!);
    subscribers.delete(userId);
    res.status(200).send('User blocked successfully');
});

app.get('/unblock/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    console.log(req.params);
    if (isNaN(userId) || blockedUsers.has(userId) === false) {
        res.status(400).send('Invalid user ID');
        return;
    }
    subscribers.set(userId, blockedUsers.get(userId)!);
    blockedUsers.delete(userId);
    res.status(200).send('User unblocked successfully');
});

app.delete('/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId) || (subscribers.has(userId) === false && blockedUsers.has(userId) === false)) {
        res.status(400).send('Invalid user ID');
        return;
    }
    if (subscribers.has(userId)) {
        subscribers.delete(userId);
    } else {
        blockedUsers.delete(userId);
    }
    res.status(200).send('User deleted successfully');
});


app.listen(8081, () => {
    console.log('Server is running on port 3000');
})

console.log('Bot is running');
bot.launch();