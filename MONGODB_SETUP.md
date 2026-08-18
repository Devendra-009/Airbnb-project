# MongoDB Atlas connection

1. Open MongoDB Atlas and create/select a cluster.
2. Create a **Database User** with a username and password.
3. Add your development IP address under **Network Access**.
4. Click **Connect → Drivers** and copy the Node.js connection string.
5. Copy `server/.env.example` to `server/.env`.
6. Replace the placeholders:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/explorelust?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

If the MongoDB password contains characters such as `@`, `:`, `/`, `?`, `#`, or `%`, URL-encode the password before putting it into `MONGO_URI`.

Never commit `server/.env` to Git.

### Optional admin account

Add these to `server/.env` temporarily:

```env
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=ChangeMe123!
```

Then run:

```bash
cd server
npm install
npm run seed
```

Change the admin password immediately after first login.
