import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../Routes';
import { useAppDispatch, useAppSelector } from '../storeHooks';
import { registerUserAsync } from '../slices/userSlice';

const RegisterPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await dispatch(registerUserAsync({ username, password }));
    if (registerUserAsync.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Container style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Регистрация</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите имя пользователя"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </Form.Group>

        <Button type="submit" disabled={loading} className="w-100">
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Регистрируем...
            </>
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
