import { Button } from "@mui/material";
import { useState } from "react";
import {
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  FileField,
  FileInput,
  Form,
  List,
  ReferenceField,
  ReferenceInput,
  SaveButton,
  SelectInput,
  TextField,
  TextInput,
  useNotify,
  useRecordContext,
} from "react-admin";
import { RespaldoLayout } from "../layout";

const RespaldoForm = ({ id, setId, accionId, personaId }) => {
  const CreateOrEdit = id === "new" ? Create : Edit;
  const notify = useNotify();
  const onSuccess = () => {
    notify("Registro guardado correctamente", "info");
    setId("");
  };
  return (
    <CreateOrEdit
      resource="respaldo"
      id={id}
      mutationMode="optimistic"
      actions={null}
      redirect={false}
      title={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Registro guardado correctamente", "info");
          setId("");
        },
      }}
    >
      <Form defaultValues={{ accionId, personaId }} redirect={false}>
        <RespaldoLayout>
          <div className="tipo">
            <ReferenceInput
              source="tipo"
              reference="param/respaldo:tipo"
              label="Tipo"
            >
              <SelectInput />
            </ReferenceInput>
          </div>
          <div className="archivo">
            <FileInput
              label="Archivo"
              source="archivo"
              accept={{
                "image/png": [".png"],
                "image/jpge": [".jpge", ".jpg"],
                "image/webp": [".webp"],
              }}
              placeholder={<b>Haga click aqui para subir un archivo</b>}
            >
              <FileField source="src" title="title" />
            </FileInput>
          </div>
          <div className="comentario">
            <TextInput
              source="comentario"
              label="Comentario"
              multiline
              rows={4}
            />
          </div>
          <div className="toolbar1">
            <SaveButton redirect={false} />
            <DeleteButton
              redirect={false}
              mutationOptions={{
                onSuccess: () => {
                  notify("Registro eliminado correctamente", "info");
                  setId("");
                },
              }}
            />
            <Button type="reset" onClick={(e) => setId("")} color="danger">
              Cancelar
            </Button>
          </div>
        </RespaldoLayout>
      </Form>
    </CreateOrEdit>
  );
};

const RespaldoTable = ({ id, setId, accionId, personaId }) => {
  const onRowClick = (id) => {
    setId(id);
    return false;
  };
  return (
    <List
      resource="respaldo"
      filterDefaultValues={{ accionId, personaId }}
      actions={
        <div>
          <Button onClick={(e) => setId("new")} color="primary">
            Adicionar
          </Button>
        </div>
      }
      title={false}
    >
      <Datagrid rowClick={onRowClick} bulkActionButtons={false} empty={false}>
        <ReferenceField
          source="tipo"
          reference="param/respaldo:tipo"
          label="Tipo"
        />
        <TextField source="comentario" label="Comentario" />
        <TextField source="archivo" label="Archivo" />
      </Datagrid>
    </List>
  );
};

export const RespaldoAccionista = () => {
  const record = useRecordContext();
  const [id, setId] = useState("");
  return (
    <div>
      {id === "" ? (
        <RespaldoTable
          accionId={record.accionId}
          personaId={record.personaId}
          id={id}
          setId={setId}
        />
      ) : (
        <RespaldoForm
          accionId={record.accionId}
          personaId={record.personaId}
          id={id}
          setId={setId}
        />
      )}
    </div>
  );
};
