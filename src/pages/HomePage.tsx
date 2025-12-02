import type { FC } from "react";
import { useState } from "react";
import { Col, Container, Row, Carousel } from "react-bootstrap";

export const HomePage: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <h1>Классификатор АГ</h1>
          <p>
            Это справочник стадий артериальной гипертензии. Используйте поиск и фильтры по
            систолическому и диастолическому давлению, чтобы найти нужную стадию. Изображения берутся
            из MinIO, при их отсутствии показывается иконка по умолчанию.
          </p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Carousel
            activeIndex={activeIndex}
            onSelect={handleSelect}
            controls
            indicators
            interval={null}
          >
            <Carousel.Item>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
                <div>
                  <h3>Поиск по стадиям</h3>
                  <p>
                    Перейдите во вкладку "Стадии" в навигации сверху, чтобы посмотреть полный список
                    стадий, воспользоваться фильтрами по давлению и найти нужную.
                  </p>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
                <div>
                  <h3>Работа с изображениями</h3>
                  <p>
                    Для каждой стадии можно подключить изображение из MinIO. Если изображение отсутствует,
                    на карточке и в деталях отображается стандартная иконка.
                  </p>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 220 }}>
                <div>
                  <h3>Демо без бэкенда</h3>
                  <p>
                    Даже при отсутствии доступа к серверу данные берутся из mock-объектов, что позволяет
                    демонстрировать интерфейс и фильтрацию автономно.
                  </p>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};