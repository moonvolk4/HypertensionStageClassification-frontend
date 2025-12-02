import type { FC } from 'react';
import { useEffect, useState } from 'react';
import "./ITunesPage.css";
import { Col, Row, Spinner, Form, Button } from "react-bootstrap";
import type { ITunesMusic } from "../modules/itunesApi";
import { getStages } from "../modules/itunesApi";
import InputField  from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { MusicCard } from "../components/MusicCard";
import { useNavigate } from "react-router-dom";
import { SONGS_MOCK } from "../modules/mock";
import { useDispatch } from "react-redux";
import { useStageFilters, setQueryAction, setSysFromAction, setSysToAction, setDiaFromAction, setDiaToAction } from "../slices/stageFilterSlice";

const ITunesPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState<ITunesMusic[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useStageFilters();

  const handleSearch = () => {
    setLoading(true);
    getStages({
      query: filters.query,
      sys_from: filters.sysFrom || undefined,
      sys_to: filters.sysTo || undefined,
      dia_from: filters.diaFrom || undefined,
      dia_to: filters.diaTo || undefined,
    })
      .then((response) => {
        setMusic(response.results);
        setLoading(false);
      })
      .catch(() => { // В случае ошибки используем mock данные, фильтруем по имени
        setMusic(
          SONGS_MOCK.results.filter((item) =>
            item.collectionCensoredName
              .toLocaleLowerCase()
              .startsWith(filters.query.toLocaleLowerCase())
          )
        );
        setLoading(false);
      });
  };

  // Auto-load initial services list on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    function handleCardClick(collectionId: number): void {
        navigate(`${ROUTES.ALBUMS}/${collectionId}`);
    }

  return (
    <div className="container-fluid">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ALBUMS }]} />
      
      <InputField
        value={filters.query}
        setValue={(value) => dispatch(setQueryAction(value))}
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
                value={filters.sysFrom || ""}
                onChange={(e) => dispatch(setSysFromAction(Number(e.target.value) || 0))}
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
                value={filters.sysTo || ""}
                onChange={(e) => dispatch(setSysToAction(Number(e.target.value) || 0))}
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
                value={filters.diaFrom || ""}
                onChange={(e) => dispatch(setDiaFromAction(Number(e.target.value) || 0))}
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
                value={filters.diaTo || ""}
                onChange={(e) => dispatch(setDiaToAction(Number(e.target.value) || 0))}
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
        (!music.length /* Проверка на существование данных */ ? (
          <div>
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} className="g-4">
            {music.map((item, index) => (
              <Col key={index}>
                <MusicCard
                  imageClickHandler={() => handleCardClick(item.collectionId)}
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