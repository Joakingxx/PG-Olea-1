import { Link } from "react-router-dom";
import { isAuthorized, decodeToken } from "../../utils/index";
import { Navbar, Container, Nav } from "react-bootstrap";
import Logo from "../../img/OLEA marca de agua-07.png";
import style from "./Navbar.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/actions";
import { BsHeartFill, BsFillChatLeftFill } from "react-icons/bs";

const NavResponsive = () => {
  const validate = isAuthorized();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoryReducer.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (validate) {
    const user = decodeToken();
    return (
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          className={style.fixed}
        >
          <Container>
            <Link to="/home">
              <Navbar.Brand>
                <img height="140px" src={Logo} alt="Olea" />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {categories?.map((category) => {
                  return (
                    <Nav.Link key={category.id}>
                      <Link
                        to={`/category/${category.nameCategory}/name/asc`}
                        className={style.links}
                      >
                        {category.nameCategory}
                      </Link>
                    </Nav.Link>
                  );
                })}
              </Nav>
              <Nav className={style.containersession}>
                <Nav.Link className={style.username}>{user.username}</Nav.Link>
                <Nav.Link>
                  <Link to="/account" className={style.linkssesion}>
                    <li>Mi cuenta</li>
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/wishlist" className={style.linkssesion}>
                    <li>
                      <BsHeartFill className={style.icon} />
                    </li>
                  </Link>
                </Nav.Link>
                {user.admin && (
                  <Nav.Link>
                    <Link to="/chat" className={style.linkssesion}>
                      <li>
                        <BsFillChatLeftFill className={style.icon} />
                      </li>
                    </Link>
                  </Nav.Link>
                )}
                <Nav.Link>
                  <Link to="/logout" className={style.linkssesion}>
                    <li>Cerrar sesión</li>
                  </Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <img height="140px" src={Logo} alt="Olea" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {categories?.map((category) => {
                return (
                  <Nav.Link key={category.id}>
                    <Link
                      to={`/category/${category.nameCategory}/name/asc`}
                      className={style.links}
                    >
                      {category.nameCategory}
                    </Link>
                  </Nav.Link>
                );
              })}
            </Nav>
            <Nav className={style.containersession}>
              <Nav.Link>
                <Link to="/login" className={style.linkssesion}>
                  <li>Iniciar sesión</li>
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/register" className={style.linkssesion}>
                  <li>Registrarse</li>
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavResponsive;
