import { Button, Container, Nav, Navbar, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import headerIcon from "../assets/header_icon.png";
import { useAppDispatch, useAppSelector } from "../storeHooks";
import { logoutUserAsync } from "../slices/userSlice";
import { resetDraft } from "../slices/draftSlice";
import { resetFilters } from "../slices/servicesSlice";
import { resetRecords } from "../slices/recordsSlice";

const Navigation = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, username, isModerator } = useAppSelector((state) => state.user);
    const draftCount = useAppSelector((state) => state.draft.count);

    const handleLogout = async () => {
        await dispatch(logoutUserAsync());
        dispatch(resetDraft());
        dispatch(resetFilters());
        dispatch(resetRecords());
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Nav className="w-100 d-flex justify-content-between">
                    <Navbar.Brand as={Link} to={ROUTES.HOME}>
                        <img src={headerIcon} alt="icon" height={24} className="me-2 align-text-top"/>
                        Классификатор АГ
                    </Navbar.Brand>
                    <div>
                        <Nav.Link as={Link} to={ROUTES.HOME} className="d-inline-block">
                            {ROUTE_LABELS.HOME}
                        </Nav.Link>
                        <Nav.Link as={Link} to={ROUTES.ALBUMS} className="d-inline-block">
                            {ROUTE_LABELS.ALBUMS}
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to={`${ROUTES.VACANCYAPPLICATION}/0`}
                            className="d-inline-block"
                            aria-disabled={!isAuthenticated}
                            style={!isAuthenticated ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
                        >
                            {ROUTE_LABELS.VACANCYAPPLICATION}{' '}
                            {isAuthenticated && draftCount > 0 && (
                                <Badge bg="secondary">{draftCount}</Badge>
                            )}
                        </Nav.Link>

                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to={ROUTES.LOGIN} className="d-inline-block">
                                    {ROUTE_LABELS.LOGIN}
                                </Nav.Link>
                                <Nav.Link as={Link} to={ROUTES.REGISTER} className="d-inline-block">
                                    {ROUTE_LABELS.REGISTER}
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to={ROUTES.RECORDS} className="d-inline-block">
                                    {ROUTE_LABELS.RECORDS}
                                </Nav.Link>
                                <Nav.Link as={Link} to={ROUTES.PROFILE} className="d-inline-block">
                                    {ROUTE_LABELS.PROFILE}
                                </Nav.Link>
                                <span className="d-inline-block ms-2">
                                    <span className="me-2">
                                        {username}
                                        {isModerator ? ' (модератор)' : ''}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </Button>
                                </span>
                            </>
                        )}
                    </div>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Navigation;