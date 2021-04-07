import express, { NextFunction, Response, Request } from 'express';
import { v4 } from 'uuid';
import { User, UserSchema } from './types';
import { userSchema } from './schema';

const PORT = 3333;

const app = express();
app.use(express.json());

const users: Array<User> = [];

const validate = (schema: UserSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error && error.isJoi) {
      res.status(400).json(error.message);
    }

    next();
  };
};

app.get('/users', (req, res) => {
  const { limit = 10, loginSubstring = '' } = req.query;

  const listUsers = users
    .filter(
      (user) => !user.isDeleted && user.login.includes(loginSubstring as string)
    )
    .sort((a, b) => a.login.localeCompare(b.login))
    .slice(0, limit as number);

  res.send(listUsers);
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const findUser = users.find((user) => user.id === id);

  if (!findUser) {
    res.status(404).send('Oops. User not found');
  }

  res.send(findUser);
});

app.post('/users', validate(userSchema), (req, res) => {
  const user = req.body as User;

  user.id = v4();
  user.isDeleted = false;

  users.push(user);
  res.status(201).send(user);
});

app.put('/users/:id', validate(userSchema), (req, res) => {
  const id = req.params.id;
  const { login, password, age } = req.body as User;

  const user = users.find((u) => u.id === id);

  if (user) {
    user.login = login;
    user.password = password;
    user.age = age;

    res.send(user);
  } else {
    res.status(404).send('Oops. User is not found');
  }
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  if (!user || user.isDeleted) {
    res.status(404).send('User is not found');
  } else {
    user.isDeleted = true;
    res.status(204).send();
  }
});

app.listen(3333, () => {
  console.log(`Running on port ${PORT}`);
});
