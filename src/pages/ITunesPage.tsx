import type { FC } from 'react';
import { useEffect } from 'react';
import "./ITunesPage.css";
import { Col, Row, Spinner, Form, Button } from "react-bootstrap";
import InputField  from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { MusicCard } from "../components/MusicCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../storeHooks";
import {
  fetchServicesAsync,
  setDiaFrom,
  setDiaTo,
  setSearchValue,
  setSysFrom,
  setSysTo,
} from "../slices/servicesSlice";
import { addServiceToDraftAsync } from "../slices/draftSlice";

const ITunesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { searchValue, services, loading, sysFrom, sysTo, diaFrom, diaTo } = useAppSelector(
    (state) => state.services,
  );
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Auto-load initial services list on mount
  useEffect(() => {
    dispatch(fetchServicesAsync());
  }, [dispatch]);

    function handleCardClick(collectionId: number): void {
        navigate(`${ROUTES.ALBUMS}/${collectionId}`);
    }

  const handleSearch = () => {
    dispatch(fetchServicesAsync());
  };

  return (
    <div className="container-fluid">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ALBUMS }]} />
      
      <InputField
        value={searchValue}
        setValue={(value) => dispatch(setSearchValue(value))}
        loading={loading}
        onSubmit={handleSearch}
        placeholder="Название стадии"
        buttonTitle="Искать"
      />

      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="sysFrom">
              <Form.Label>Систолическое от</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={sysFrom || ""}
                onChange={(e) => dispatch(setSysFrom(Number(e.target.value) || 0))}
                placeholder="напр. 120"
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="sysTo">
              <Form.Label>Систолическое до</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={sysTo || ""}
                onChange={(e) => dispatch(setSysTo(Number(e.target.value) || 0))}
                placeholder="напр. 140"
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="diaFrom">
              <Form.Label>Диастолическое от</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={diaFrom || ""}
                onChange={(e) => dispatch(setDiaFrom(Number(e.target.value) || 0))}
                placeholder="напр. 80"
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group controlId="diaTo">
              <Form.Label>Диастолическое до</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={diaTo || ""}
                onChange={(e) => dispatch(setDiaTo(Number(e.target.value) || 0))}
                placeholder="напр. 90"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2}>
            <Button variant="secondary" onClick={handleSearch} disabled={loading}>
              Применить фильтры
            </Button>
          </Col>
        </Row>
      </Form>

      {loading && ( // здесь можно было использовать тернарный оператор, но это усложняет читаемость
        <div className="loadingBg">
          <Spinner animation="border" />
        </div>
      )}
      {!loading &&
        (!services.length /* Проверка на существование данных */ ? (
          <div>
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} className="g-4">
            {services.map((item, index) => (
              <Col key={index}>
                <MusicCard
                  imageClickHandler={() => handleCardClick(item.collectionId)}
                  onAdd={
                    isAuthenticated
                      ? () => dispatch(addServiceToDraftAsync(item))
                      : undefined
                  }
                  {...item}
                />
              </Col>
            ))}
          </Row>
        ))}
    </div>
  );
};

export default ITunesPage;