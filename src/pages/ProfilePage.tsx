import type { FC } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';

import { useAppDispatch, useAppSelector } from '../storeHooks';
import { logoutUserAsync } from '../slices/userSlice';

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, username } = useAppSelector((state) => state.user);

  return (
    <Container style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Личный кабинет</h2>

      {!isAuthenticated ? (
        <Alert variant="warning">Вы не авторизованы.</Alert>
      ) : (
        <Alert variant="success">Вы вошли как: {username}</Alert>
      )}

      <Form className="mb-3">
        <Form.Group controlId="newPassword">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control type="password" placeholder="(нет endpoint в swagger)" disabled />
        </Form.Group>
        <Form.Group className="mt-2" controlId="repeatPassword">
          <Form.Label>Повторите пароль</Form.Label>
          <Form.Control type="password" placeholder="(нет endpoint в swagger)" disabled />
        </Form.Group>
        <Button className="mt-3" variant="secondary" disabled>
          Сменить пароль
        </Button>
      </Form>

      {isAuthenticated && (
        <Button variant="outline-danger" onClick={() => dispatch(logoutUserAsync())}>
          Выйти
        </Button>
      )}
    </Container>
  );
};

export default ProfilePage;
