import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import styles from "./Product.module.css";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../redux/actions/index";
import { isAuthorized, decodeToken } from "../../utils/index";
import { addOrEditCart, removeProductCart } from "../../cart/index";
import { BsBag, BsBagCheckFill, BsHeart, BsHeartFill } from "react-icons/bs";
export function Product({ id, name, image, price }) {
  const [add, setAdd] = useState(false);
  const [remove, setRemove] = useState(false);
  const dispatch = useDispatch();
  const quantity = 1;
  const validate = isAuthorized();
  //favorite
  const [favorite, setFavorite] = useState(false);
  const { productsCarrito } = useSelector((state) => state.carritoReducer);

  useEffect(() => {
    if (add) {
      const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart"));
      const cartAdded = [
        ...cartFromLocalStorage,
        { id, name, image, price, quantity },
      ];
      localStorage.setItem("cart", JSON.stringify(cartAdded));
      dispatch(updateCart(cartAdded));
      setAdd(false);
    }
    if (remove) {
      const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart"));
      const cartRemoved = cartFromLocalStorage.filter(
        (product) => product.id !== id
      );
      localStorage.setItem("cart", JSON.stringify(cartRemoved));
      dispatch(updateCart(cartRemoved));
      setRemove(false);
    }
  }, [dispatch, add, remove, id, image, name, price]);

  const isInStore = productsCarrito.findIndex((product) => product.id === id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    setAdd(true);
    if (validate) {
      const user = decodeToken();
      const username = user.username;
      addOrEditCart({
        productID: id,
        quantity: quantity,
        username: username,
      });
    }
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    setRemove(true);
    if (validate) {
      const user = decodeToken();
      const username = user.username;
      removeProductCart({
        productID: id,
        username: username,
      });
    }
  };

  //////

  const handleAddFavorite = (e) => {
    e.preventDefault();
    setFavorite(true);
  };
  const handleRemoveFavorite = (e) => {
    e.preventDefault();
    setFavorite(false);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {/* favorite */}
        {favorite && (
          <button
            className={styles.fav}
            onClick={(e) => handleRemoveFavorite(e)}
          >
            <BsHeartFill className={styles.removefav} />
          </button>
        )}
        {!favorite && (
          <button className={styles.fav} onClick={(e) => handleAddFavorite(e)}>
            <BsHeart className={styles.addfav} />
          </button>
        )}
        {/* termina favorite */}
        {isInStore === -1 && (
          <button
            className={styles.cart}
            title="click here"
            type="submit"
            onClick={(e) => handleAddToCart(e)}
          >
            <BsBag className={styles.iconcart} />
          </button>
        )}
        {isInStore >= 0 && (
          <button
            className={styles.cart}
            title="click here"
            type="submit"
            onClick={(e) => handleRemoveFromCart(e)}
          >
            <BsBagCheckFill className={styles.iconcart} />
          </button>
        )}
        <Card.Img
          className={styles.img}
          variant="top"
          src={image ? image : ""}
          alt="producto"
        />{" "}
        <Card.Body>
          <div className={styles.cardbody}>
            <Link className={styles.link} to={`/product/${id}`}>
              <h5 className={styles.titlecard}>{name}</h5>
            </Link>
            <Card.Text className={styles.subtitlecard}>$ {price}</Card.Text>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
