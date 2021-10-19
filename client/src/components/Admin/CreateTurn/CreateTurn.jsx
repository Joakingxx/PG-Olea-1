import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { getStores } from "../../../redux/actions";
import { newTurn } from "../../../turns/index";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import { decodeToken } from "../../../utils";

export default function CreateTurn() {
  const [value, onChange] = useState(new Date());
  const [turn, setTurn] = useState({ store: "", date: "", hour: "" });
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.storesReducer.stores);

  useEffect(() => {
    dispatch(getStores());
  }, []);

  const onChangeTurn = (e) => {
    e.preventDefault();
    setTurn({
      ...turn,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!turn.store && !turn.hour && !value) {
      return alert("faltan parametros");
    }
    let valor = value.toLocaleDateString();
    newTurn({ store: turn.store, date: valor, hour: turn.hour });
    setTurn({ store: "", date: "", hour: "" });
    swal("Se creó el turno");
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <label>Local</label>
        <select onChange={(e) => onChangeTurn(e)} name="store">
          <option value="" selected disabled hidden>
            Seleccione una sucursal
          </option>
          {stores &&
            stores.map((s) => (
              <option value={s.address} key={s.id}>
                {s.address}
              </option>
            ))}
        </select>
        <label>Fecha</label>
        <Calendar onChange={onChange} value={value} />
        <label>Horario</label>
        <select onChange={(e) => onChangeTurn(e)} name="hour">
          <option value="" selected disabled hidden>
            Seleccione un horario
          </option>
          <option value="10-11hs">10 - 11hs</option>
          <option value="11-12hs">11 - 12hs</option>
          <option value="12-13hs">12 - 13hs</option>
          <option value="13-14hs">13 - 14hs</option>
          <option value="14-15hs">14 - 15hs</option>
          <option value="15-16hs">15 - 16hs</option>
          <option value="16-17hs">16 - 17hs</option>
          <option value="17-18hs">17 - 18hs</option>
        </select>
        <Button type="submit">Crear turno</Button>
      </form>
    </div>
  );
}
