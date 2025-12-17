import "./AlbumPage.css";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { useParams } from "react-router-dom";
import type { ITunesMusic } from "../modules/itunesApi";
import { getStageByIdRaw, stageToITunes } from "../modules/itunesApi";
import { Col, Row, Spinner, Image } from "react-bootstrap";
import { SONGS_MOCK } from "../modules/mock";
import defaultimage from "../assets/header_icon.png";

export const AlbumPage: FC = () => {
  const [pageData, setPageDdata] = useState<ITunesMusic>();
  const [raw, setRaw] = useState<any>(null);

  const { id } = useParams(); // ид страницы, пример: "/stages/12"

  useEffect(() => {
    if (!id) return;
    getStageByIdRaw(id)
      .then((rawStage) => {
        setRaw(rawStage);
        setPageDdata(stageToITunes(rawStage));
      })
      .catch(() =>
        setPageDdata(
          SONGS_MOCK.results.find((album) => String(album.collectionId) == id)
        ),
      );
  }, [id]);

  const getAny = (obj: any, keys: string[]) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return undefined;
  };

  const description = getAny(raw, ['Description', 'description', 'desc', 'details']);
  const pressure = getAny(raw, ['Pressure', 'pressure']);
  const riskName = getAny(raw, ['RiskName', 'risk_name', 'riskName', 'RiskClass', 'riskClass']);
  const code = getAny(raw, ['Code', 'code']);
  const sysFrom = getAny(raw, ['SysFrom', 'sys_from', 'sysFrom']);
  const sysTo = getAny(raw, ['SysTo', 'sys_to', 'sysTo']);
  const diaFrom = getAny(raw, ['DiaFrom', 'dia_from', 'diaFrom']);
  const diaTo = getAny(raw, ['DiaTo', 'dia_to', 'diaTo']);


  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.ALBUMS, path: ROUTES.ALBUMS },
          { label: pageData?.collectionCensoredName || "Услуга" },
        ]}
      />
      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="container">
          <Row>
            <Col md={6}>
              <p>
                Название: <strong>{pageData.collectionCensoredName}</strong>
              </p>
              {description && (
                <p>
                  Описание: <strong>{String(description)}</strong>
                </p>
              )}
              {pressure && (
                <p>
                  Давление: <strong>{String(pressure)}</strong>
                </p>
              )}
              {riskName && (
                <p>
                  Риск: <strong>{String(riskName)}</strong>
                </p>
              )}
              {code && (
                <p>
                  Код: <strong>{String(code)}</strong>
                </p>
              )}
              {(sysFrom || sysTo || diaFrom || diaTo) && (
                <p>
                  Диапазон: <strong>{String(sysFrom ?? '—')}–{String(sysTo ?? '—')}</strong>{' '}
                  / <strong>{String(diaFrom ?? '—')}–{String(diaTo ?? '—')}</strong>
                </p>
              )}
            </Col>
            <Col md={6}>
              <Image
                src={pageData.artworkUrl100 || defaultimage} // дефолтное изображение, если нет artworkUrl100
                alt="Картинка"
                width={100}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="album_page_loader_block">{/* загрузка */}
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};