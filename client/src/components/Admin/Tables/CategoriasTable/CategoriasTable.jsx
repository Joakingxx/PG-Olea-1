import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { getCategories } from "../../../../redux/actions";
import swal from "sweetalert";
import CategoriasEdit from "../CategoriasTable/CategoriasEdit";
import { deleteCategory } from "../../../../auth/admin";
import { confirmAlert } from "react-confirm-alert"; // Import
import CreateCategory from "../../CreateCategory/CreateCategory";
export default function CategoriasTable() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoryReducer.categories);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  const remove = (name, id) => {
    confirmAlert({
      title: "Eliminar categoria",
      message: `Desea eliminar ${name}`,
      buttons: [
        {
          label: "Si",
          onClick: async () => {
            await removeCat(id);
            swal("Esta categoria ha sido eliminado");
            window.location.reload(false);
          },
        },
        {
          label: "No",
          onClick: () => console.log("zs"),
        },
      ],
    });
  };
  const removeCat = async (id) => {
    await deleteCategory(id);
  };
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((e) => {
            return (
              <tr>
                <td>{e.id}</td>
                <td>{e.nameCategory}</td>
                <td>
                  <CategoriasEdit id={e.id} nameCategory={e.nameCategory} />
                </td>
                <td>
                  <Button onClick={() => remove(e.nameCategory, e.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <CreateCategory />
      </Table>
    </div>
  );
}
