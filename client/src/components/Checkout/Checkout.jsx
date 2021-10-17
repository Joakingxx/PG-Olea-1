import React, { useState } from "react";
import Details from "./CheckoutDetail/CheckoutDetail";
import { decodeToken, isAuthorized } from "../../utils";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { checkoutMercadoPago } from "../../redux/actions";
import { createOrder } from "../../order";
import style from "./Checkout.module.css";
import { format } from "../../utils/index";
import { Card, ListGroup, Form } from "react-bootstrap";
import swal from "sweetalert";

const Checkout = () => {
  const history = useHistory();
  const sesionIniciada = isAuthorized();
  const datosLogin = decodeToken();
  const dispatch = useDispatch();

  let linkDePago = useSelector((state) => state.carritoReducer.linkPago);
  console.log("link", linkDePago);
  const itemsCheckout = useSelector(
    (state) => state.carritoReducer.productsCarrito
  );

  const [delivery, setDelivery] = useState("");
  const handleSelected = (e) => {
    e.preventDefault();
    setDelivery(e.target.value);
  };

  const desc = itemsCheckout?.reduce((acc, curr) => {
    let result = 0;
    if (curr.Carrito_Products) {
      if (curr.offer >= curr.categories?.[0].offer) {
        result =
          acc +
          parseInt(
            curr.price - Math.round(parseInt(curr.price * curr.offer) / 100)
          ) *
            curr.Carrito_Products.quantity;
      } else if (curr.offer < curr.categories?.[0].offer) {
        result =
          acc +
          parseInt(
            curr.price -
              Math.round(
                parseInt(curr.price * curr.categories?.[0].offer) / 100
              )
          ) *
            curr.Carrito_Products.quantity;
      } else {
        result = acc + parseInt(curr.price) * curr.Carrito_Products.quantity;
      }
    }
    if (curr.quantity) {
      if (curr.offer >= curr.categories?.[0].offer) {
        result =
          acc +
          parseInt(
            curr.price - Math.round(parseInt(curr.price * curr.offer) / 100)
          ) *
            curr.quantity;
      } else if (curr.offer < curr.categories?.[0].offer) {
        result =
          acc +
          parseInt(
            curr.price -
              Math.round(
                parseInt(curr.price * curr.categories?.[0].offer) / 100
              )
          ) *
            curr.quantity;
      } else {
        result = acc + parseInt(curr.price) * curr.quantity;
      }
    }
    return result;
  }, 0);

  const [order, setOrder] = useState({
    username: datosLogin.username,
    email: datosLogin.email,
    price: desc,
    products: itemsCheckout,
    address: delivery,
    phone: "",
    contactName: "",
    contactSurname: "",
  });

  let idOrden = "";
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!order.phone && !order.contactName && !order.contactSurname) {
      return swal("Por favor, completá los datos personales");
    }
    if (!delivery) {
      swal("Por favor, seleccione una opción de envío");
    } else if (delivery === "Envío" && !order.address) {
      swal("Completá la dirección de envío");
    } else if (delivery === "Envío" && order.address) {
      return dispatch(checkoutMercadoPago(itemsCheckout, idOrden));
    } else if (delivery === "Retiro por local") {
      return dispatch(checkoutMercadoPago(itemsCheckout, idOrden));
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={style.cnt}>
      <div className="container">
        {sesionIniciada === true ? (
          <div>
            <div>
              <Card className={style.card}>
                <div className={style.headers}>
                  <Card.Header className={style.title}>
                    1 - Datos Personales
                  </Card.Header>
                </div>
                <ListGroup className={style.listgroup}>
                  <ListGroup.Item className={style.listgroup}>
                    <div className={style.labels}>
                      <label> Nombre </label>{" "}
                      <Form.Control
                        name="contactName"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        className={style.input}
                        type="text"
                        placeholder="Nombre"
                        defaultValue={datosLogin.name}
                      />
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className={style.listgroup}>
                    <div className={style.labels}>
                      <label> Apellido </label>
                      <Form.Control
                        className={style.input}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        name="contactSurname"
                        type="text"
                        placeholder="Apellido"
                        defaultValue={datosLogin.surname}
                      />
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className={style.listgroup}>
                    <div className={style.labels}>
                      <label> Teléfono </label>{" "}
                      <Form.Control
                        className={style.input}
                        type="text"
                        placeholder="Teléfono"
                        name="phone"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
            <div>
              <div className={style.headers}>
                <Card.Header className={style.title}>
                  2 - Datos de Envío
                </Card.Header>
              </div>
              <div className={style.btns}>
                <input
                  type="radio"
                  class="btn-check"
                  name="options"
                  id="option1"
                  autocomplete="off"
                  onChange={(e) => {
                    handleSelected(e);
                  }}
                  value="Envío"
                  name="options"
                />
                <label class="btn btn-secondary" for="option1">
                  Envío
                </label>

                <input
                  type="radio"
                  class="btn-check"
                  name="options"
                  id="option2"
                  autocomplete="off"
                  onChange={(e) => {
                    handleSelected(e);
                  }}
                  value="Retiro por local"
                  name="options"
                />
                <label class="btn btn-secondary" for="option2">
                  Retiro por local
                </label>
              </div>
              <Card.Body className={style.bodyDelivery} eventKey={delivery}>
                {delivery === "Envío" ? (
                  <div className={style.pdn}>
                    <Card.Title className={style.labels}>Envío</Card.Title>
                    <Form.Group className={style.datosEnvio}>
                      <Form.Label className={style.labels}>Domicilio de envío</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Domicilio de Envío"
                        name="address"
                        className={style.inputDatosEnvio}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </Form.Group>
                  </div>
                ) : (
                  <div className={style.pdn}>
                    <Card.Title className={style.labels}>Retiro</Card.Title>
                    <Card.Text className={style.text}>
                      Pasá a retirar tu pedido por Garibaldi 283, Coronel Suárez
                      <br />
                      Horario : Lu a Vi 9: 30-12: 30, 17: 30-19: 30 y Sa 10-12:
                      30
                    </Card.Text>
                  </div>
                )}
              </Card.Body>
            </div>
            <Details />

            <p className={style.total}> Total ${format(desc)}</p>
          <div className={style.buttonConfirmarCompra}>
            <Button variant="dark" onClick={(e) => handleConfirmOrder(e)}>
              Confirmar orden de compra
            </Button>
            {linkDePago &&
              confirmAlert({
                title: "Atención",
                message: "Usted será redirigido al checkout de Mercado Pago",
                buttons: [
                  {
                    label: "Aceptar",
                    onClick: async () => {
                      idOrden = await createOrder(order);
                      window.open(linkDePago);
                      localStorage.setItem("cart", JSON.stringify([]));
                      window.location.href = "/";
                    },
                    {
                      label: "Volver",
                      onClick: () => {
                        window.location.href = "";
                      },
                    },
                  ],
                })}
            </div>
          </div>
        ) : (
          <div>
            {confirmAlert({
              title: "No iniciaste sesión",
              message:
                "Para continuar con tu compra debes registrarte o iniciar sesión",
              buttons: [
                {
                  label: "Iniciar Sesión",
                  onClick: () => history.push("/login"),
                },
                {
                  label: "Registrarse",
                  onClick: () => history.push("/register"),
                },
                {
                  label: "Inicio",
                  onClick: () => history.push("/"),
                },
              ],
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Checkout;
