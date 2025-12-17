import type { FC } from 'react';
import { useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '../../Routes';
import { useAppDispatch, useAppSelector } from '../storeHooks';
import {
  deleteDraftAsync,
  deleteServiceFromDraftAsync,
  setComment,
  setError,
  setMaxAd,
  setPatientName,
  toggleFlag,
} from '../slices/draftSlice';
import { formRecordFromDraftAsync } from '../slices/recordsSlice';

const VacancyApplicationPage: FC = () => {
  const { app_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const { items, count, flags, patientName, maxAd, comment, error } = useAppSelector(
    (state) => state.draft,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.ALBUMS);
    }
  }, [isAuthenticated, navigate]);

  const handleClear = async () => {
    await dispatch(deleteDraftAsync());
    navigate(ROUTES.ALBUMS);
  };

  const handleForm = async () => {
    dispatch(setError(null));
    const result = await dispatch(formRecordFromDraftAsync());
    if (formRecordFromDraftAsync.fulfilled.match(result)) {
      await dispatch(deleteDraftAsync());
      navigate(ROUTES.RECORDS);
      return;
    }
    const msg = (result.payload as string) || 'Не удалось сформировать заявку';
    dispatch(setError(msg));
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>
            Заявка пациента <span className="text-muted">{count} услуги</span>
          </h2>
          <div className="text-muted">app_id: {app_id}</div>
        </Col>
        <Col className="text-md-end">
          <div className="d-inline-flex gap-2">
            <Button
              variant="primary"
              disabled={items.length === 0}
              onClick={handleForm}
            >
              Сформировать
            </Button>
            <Button variant="danger" onClick={handleClear}>
              Удалить заявку
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="border rounded p-3 mb-4">
        <div className="fw-semibold mb-2">Факторы/флажки</div>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Гипертрофия ЛЖ"
              checked={flags.lvh}
              onChange={() => dispatch(toggleFlag('lvh'))}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Почечное поражение"
              checked={flags.kidneyDamage}
              onChange={() => dispatch(toggleFlag('kidneyDamage'))}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Жёсткость артерий"
              checked={flags.arteryStiffness}
              onChange={() => dispatch(toggleFlag('arteryStiffness'))}
            />
          </Col>
        </Row>

        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="patientName">
              <Form.Label>ФИО пациента</Form.Label>
              <Form.Control
                value={patientName}
                onChange={(e) => dispatch(setPatientName(e.target.value))}
                placeholder="Иванов Иван Иванович"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="maxAd">
              <Form.Label>Максимальное АД</Form.Label>
              <Form.Control
                value={maxAd}
                onChange={(e) => dispatch(setMaxAd(e.target.value))}
                placeholder="Напр. 145/95"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <h4 className="mb-3">Выбранные стадии</h4>
      {items.length === 0 ? (
        <div>Пока ничего не добавлено</div>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Иконка</th>
              <th>Название</th>
              <th>Давление</th>
              <th>Кол-во</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.service.collectionId}>
                <td style={{ width: 80 }}>
                  <img
                    src={item.service.artworkUrl100}
                    alt="stage"
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <a
                    href={`#${ROUTES.ALBUMS}/${item.service.collectionId}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.service.collectionCensoredName}
                  </a>
                </td>
                <td>{item.service.pressure ?? '—'}</td>
                <td>{item.count}</td>
                <td style={{ width: 120 }}>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => dispatch(deleteServiceFromDraftAsync(item.service.collectionId))}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="border rounded p-3 mt-4">
        <div className="fw-semibold mb-2">Комментарий к заявке</div>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => dispatch(setComment(e.target.value))}
          placeholder="Комментарий отсутствует."
        />
      </div>
    </Container>
  );
};

export default VacancyApplicationPage;
