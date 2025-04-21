import { Base64ImageField } from "_client/ui/base64ImageField";
import { RecordDisplay } from "_client/ui/display";
import { Fragment } from "react";
import {
  ArrayField,
  DateField,
  Labeled,
  NumberField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";
import {
  AccionLayout,
  CobroLayout,
  CobroTipoLayout,
  DepositoLayout,
  PageLayout,
  PersonaLayout,
  RespaldoLayout,
  TableLayout,
  TitleLayout,
} from "./layout";

export const ReportContent = () => {
  return (
    <PageLayout id="pdf-export">
      <TitleLayout>
        <h1>Empresa Minera Katanani</h1>
        <h2>Ficha de Accionista</h2>
        <h3>
          CODIGO: <TextField source="id" />
        </h3>
      </TitleLayout>
      <div>
        <TitleLayout className="eee">Datos de la Accion</TitleLayout>
        <AccionLayout>
          <div className="serie">
            <Labeled label="Serie">
              <TextField source="accion.serie" />
            </Labeled>
          </div>
          <div className="codigo">
            <Labeled label="Acción">
              <TextField source="accion.codigo" />
            </Labeled>
          </div>
          <div className="porcentaje">
            <Labeled>
              <NumberField
                label="Porcentaje"
                source="accion.porcentaje"
                options={{ style: "percent", minimumFractionDigits: 2 }}
              />
            </Labeled>
          </div>
          <div className="precio">
            <Labeled>
              <NumberField
                label="Precio"
                source="accion.precio"
                options={{
                  style: "currency",
                  currency: "BOB",
                  minimumFractionDigits: 2,
                }}
              />
            </Labeled>
          </div>
        </AccionLayout>
      </div>
      <div>
        <TitleLayout className="eee">Datos de Depostito</TitleLayout>
        <DepositoLayout>
          <div className="banco">
            <Labeled label="Banco">
              <ReferenceField
                source="accionista.banco"
                reference="param/accionista:banco"
                link={false}
              />
            </Labeled>
          </div>
          <div className="recibo">
            <Labeled label="Recibo">
              <TextField source="accionista.recibo" />
            </Labeled>
          </div>
          <div className="fecha">
            <Labeled label="Fecha">
              <DateField source="accionista.fecha" />
            </Labeled>
          </div>
          <div className="confirmacion">
            <Labeled label="Confirmacion">
              <TextField source="accionista.confirmacion" />
            </Labeled>
          </div>
        </DepositoLayout>
      </div>
      <div>
        <TitleLayout className="eee">Datos Personales</TitleLayout>
        <PersonaLayout>
          <div className="nombres">
            <Labeled label="Nombres">
              <TextField source="persona.nombres" />
            </Labeled>
          </div>
          <div className="apellido1">
            <Labeled label="Primer Appelido">
              <TextField source="persona.apellido1" />
            </Labeled>
          </div>
          <div className="apellido2">
            <Labeled label="Segundo Appelido">
              <TextField source="persona.apellido2" />
            </Labeled>
          </div>
          <div className="docTipo">
            <Labeled label="Tipo Documento">
              <ReferenceField
                source="persona.docTipo"
                reference="param/persona:docTipo"
              />
            </Labeled>
          </div>
          <div className="docNumero">
            <Labeled label="Número de Documento">
              <TextField source="persona.docNumero" />
            </Labeled>
          </div>
          <div className="celular">
            <Labeled label="Celular">
              <TextField source="persona.celular" />
            </Labeled>
          </div>
          <div className="correo">
            <Labeled label="Correo">
              <TextField source="persona.correo" />
            </Labeled>
          </div>
          <div className="ciudad">
            <Labeled label="Ciudad">
              <ReferenceField
                source="persona.ciudad"
                reference="param/persona:ciudad"
              />
            </Labeled>
          </div>
          <div className="direccion">
            <Labeled label="Direccion">
              <TextField source="persona.direccion" />
            </Labeled>
          </div>
        </PersonaLayout>
      </div>
      <div>
        <TitleLayout className="eee">Datos de Contactos</TitleLayout>
        <TableLayout>
          <ArrayField source="contactos">
            <SingleFieldList linkType={false} component={Fragment}>
              <tr>
                <td>
                  <Labeled label="Relacion del Contacto">
                    <ReferenceField
                      source="tipo"
                      reference="param/contacto:tipo"
                    />
                  </Labeled>
                </td>
                <td>
                  <Labeled label="Nombre Completo">
                    <TextField source="nombre" />
                  </Labeled>
                </td>
                <td>
                  <Labeled label="Celular de Contacto">
                    <TextField source="celular" />
                  </Labeled>
                </td>
              </tr>
            </SingleFieldList>
          </ArrayField>
        </TableLayout>
      </div>
      <div>
        <TitleLayout className="eee">Forma de Cobro</TitleLayout>
        <CobroTipoLayout>
          <div className="tipo">
            <Labeled label="Forma de Cobro">
              <ReferenceField
                source="cobro.tipo"
                reference="param/cobro:tipo"
              />
            </Labeled>
          </div>
          <div className="estado">
            <Labeled>
              <ReferenceField
                source="cobro.estado"
                reference="param/cobro:estado"
                label="Estado"
              />
            </Labeled>
          </div>
        </CobroTipoLayout>
        <RecordDisplay rule={(r) => r?.cobro?.tipo === 4}>
          <CobroLayout>
            <div className="banco">
              <Labeled>
                <ReferenceField
                  source="cobro.banco"
                  reference="param/cobro:banco"
                  label="Banco"
                />
              </Labeled>
            </div>
            <div className="moneda">
              <Labeled>
                <ReferenceField
                  source="cobro.moneda"
                  reference="param/cobro:moneda"
                  label="Moneda"
                />
              </Labeled>
            </div>
            <div className="cuenta">
              <Labeled label="Numero Cuenta">
                <TextField source="cobro.cuenta" />
              </Labeled>
            </div>
            <div className="respaldo"></div>
          </CobroLayout>
        </RecordDisplay>
      </div>
      <div>
        <TitleLayout className="eee">Asesor Katanani</TitleLayout>
        <PersonaLayout>
          <div className="nombres">
            <Labeled label="Nombres">
              <TextField source="asesor.nombres" />
            </Labeled>
          </div>
          <div className="apellido1">
            <Labeled label="Primer Appelido">
              <TextField source="asesor.apellido1" />
            </Labeled>
          </div>
          <div className="apellido2">
            <Labeled label="Segundo Appelido">
              <TextField source="asesor.apellido2" />
            </Labeled>
          </div>
          <div className="docTipo">
            <Labeled label="Tipo Documento">
              <ReferenceField
                source="asesor.docTipo"
                reference="param/persona:docTipo"
              />
            </Labeled>
          </div>
          <div className="docNumero">
            <Labeled label="Número de Documento">
              <TextField source="asesor.docNumero" />
            </Labeled>
          </div>
        </PersonaLayout>
      </div>
      <TitleLayout className="eee">Documento de Respaldos</TitleLayout>
      <ArrayField source="respaldos" component={Fragment}>
        <SingleFieldList linkType={false} component={Fragment}>
          <RespaldoLayout>
            <div className="archivo">
              <TextField source="archivo" />
            </div>
            <div className="base64">
              <Base64ImageField source="base64" />
            </div>
            <div className="comentario">
              <TextField source="comentario" />
            </div>
          </RespaldoLayout>
        </SingleFieldList>
      </ArrayField>
      <RespaldoLayout>
        <div className="archivo">
          <TextField source="cobro.respaldo" />
        </div>
        <div className="base64">
          <Base64ImageField
            source="cobro.base64"
            imageStyle={{
              maxHeight: "200px",
            }}
          />
        </div>
        <div className="comentario">
          <TextField source="cobro.comentario" />
        </div>
      </RespaldoLayout>
    </PageLayout>
  );
};
