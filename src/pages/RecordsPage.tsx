import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../Routes';
import { useAppDispatch, useAppSelector } from '../storeHooks';
import { fetchRecordsAsync } from '../slices/recordsSlice';

const formatDate = (value?: string | null): string => {
  if (!value) return '';
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const RecordsPage: FC = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const isModerator = useAppSelector((state) => state.user.isModerator);
  const { items, loading, error } = useAppSelector((state) => state.records);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [creatorFilter, setCreatorFilter] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchRecordsAsync());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Container>
        <Alert variant="warning">
          Для просмотра заявок нужно авторизоваться.
        </Alert>
        <Link to={ROUTES.LOGIN} className="btn btn-primary">
          Войти
        </Link>
      </Container>
    );
  }

  const statusOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        items
          .map((x) => (x.status === undefined || x.status === null ? '' : String(x.status)))
          .filter(Boolean),
      ),
    );
    values.sort();
    return values;
  }, [items]);

  const filteredItems = useMemo(() => {
    const fromTime = dateFrom ? Date.parse(dateFrom) : NaN;
    const toTime = dateTo ? Date.parse(dateTo) : NaN;
    const creatorNeedle = creatorFilter.trim().toLowerCase();

    return items.filter((r) => {
      if (statusFilter && String(r.status ?? '') !== statusFilter) return false;

      if (creatorNeedle) {
        const idHay = String(r.creator_id ?? '').toLowerCase();
        const userHay = String((r as any).creator_username ?? '').toLowerCase();
        if (!idHay.includes(creatorNeedle) && !userHay.includes(creatorNeedle)) return false;
      }

      if (dateFrom || dateTo) {
        const created = r.created_at ? Date.parse(r.created_at) : NaN;
        if (!Number.isFinite(created)) return false;
        if (Number.isFinite(fromTime) && created < fromTime) return false;
        // date inputs are inclusive by day; treat end date as end-of-day
        if (Number.isFinite(toTime) && created > toTime + 24 * 60 * 60 * 1000 - 1) return false;
      }

      return true;
    });
  }, [items, statusFilter, dateFrom, dateTo, creatorFilter]);

  return (
    <Container>
      <h2 className="mb-3">{isModerator ? 'Все заявки' : 'Мои заявки'}</h2>

      <div className="border rounded p-3 mb-3">
        <Row className="g-2 align-items-end">
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="status">
              <Form.Label>Статус</Form.Label>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Любой</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="dateFrom">
              <Form.Label>Дата начала</Form.Label>
              <Form.Control type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="dateTo">
              <Form.Label>Дата окончания</Form.Label>
              <Form.Control type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="creator">
              <Form.Label>Создатель</Form.Label>
              <Form.Control
                value={creatorFilter}
                onChange={(e) => setCreatorFilter(e.target.value)}
                placeholder={isModerator ? 'ID создателя' : 'ID'}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredItems.length === 0 ? (
            <div className="text-muted">Заявок нет</div>
          ) : (
            filteredItems.map((r) => (
              <Card key={r.id}>
                <Card.Body>
                  <Card.Title className="mb-3">Заявка №{r.id}</Card.Title>
                  <Row className="g-2">
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        статус
                      </div>
                      <div>{String(r.status ?? '')}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        дата создания
                      </div>
                      <div>{formatDate(r.created_at)}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        дата подачи
                      </div>
                      <div>{formatDate(r.formed_at)}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        создатель
                      </div>
                      <div>{(r as any).creator_username ?? r.creator_id ?? ''}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        завершена
                      </div>
                      <div>{formatDate(r.finished_at)}</div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        кол-во услуг
                      </div>
                      <div>{r.items_count ?? ''}</div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        комментарий
                      </div>
                      <div>{r.comment ?? ''}</div>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    <Link to={`${ROUTES.VACANCYAPPLICATION}/${r.id}`} className="btn btn-link p-0">
                      Открыть
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      )}
    </Container>
  );
};

export default RecordsPage;
