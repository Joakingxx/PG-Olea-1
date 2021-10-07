import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCategories } from "../../redux/actions";

export default function Selects() {
  const dispatch = useDispatch();
  const history = useHistory();
  // const categories = useSelector((state) => state.categoryReducer.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // function handleCategorySelect(name) {
  //   history.push(`/category/${name}`);
  // }

  const handleOrderSelect = function (order) {
    order = order.split(" ");
    history.push(`/home/${order[0]}/${order[1]}`);
  };

  return (
    <div>
      {/* <select onChange={(e) => handleCategorySelect(e.target.value)}>
        <option disabled selected hidden>
          Category...
        </option>
        {categories?.map((c) => (
          <option value={c.nameCategory}>{c.nameCategory}</option>
        ))}
      </select> */}
      <select onChange={(e) => handleOrderSelect(e.target.value)}>
        <option disabled selected hidden>
          Select order...
        </option>
        <option value={"name asc"}>Order by name: A-Z</option>
        <option value={"name desc"}>Order by name: Z-A</option>
        <option
          value={"price desc"}
          onChange={(e) => handleOrderSelect(e.target.name, e.target.value)}
        >
          Order by price: highest to lowest
        </option>
        <option value={"price asc"}>Order by price: lowest to highest</option>
      </select>
    </div>
  );
}
