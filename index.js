process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
    secret: 'X2ftxtmX51pbHretxO_nhBhtczYa',  
    baseURL: 'https://gjfrttmj-3000.brs.devtunnels.ms', 
    clientID: 'PJB4NJhzphUYiDW0FdG4c6gFYo0a',
    issuerBaseURL: 'https://192.168.43.221:9443/oauth2/oidcdiscovery'
};

app.use(express.json());
app.use(auth(config));

app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json({ 
            mensaje: 'Bienvenido a la api configurada con zero trust',
        });
    } else {
        res.json({ mensaje: 'Estás desconectado (Logged out)' });
    }
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.json({
    mensaje: '¡Solo puedes ver esto si estás logueado!',
    usuario: req.oidc.user
  });
});

const usersRoutes = require('./routes/users');
const devicesRoutes = require('./routes/devices');

app.use('/api/users', requiresAuth(), usersRoutes);
app.use('/api/devices', requiresAuth(), devicesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});