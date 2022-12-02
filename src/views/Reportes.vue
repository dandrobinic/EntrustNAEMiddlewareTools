<template>
    <div class="">
      <h1>Reportes</h1>
      <table id="exampl" class="table cell-border ">
          <thead class="TableHead">
              <tr>
                  <th>Accion</th>
                  <th>Usuario</th>
                  <th>Proceso</th>
                  <th>Resultado</th>
                  <th>Status</th>
                  <th>Editar</th>
              </tr>
          </thead>
          <tbody>
              <tr class="firstRow">
                  <td>Envio de OTP</td>
                  <td>107740574</td>
                  <td>Proceso MFA Claro</td>
                  <td>Exitoso</td>
                  <td>200</td>
                  <td><div class="toggle">
                      <input type="checkbox">
                      <label for="" class="onbtn">On</label>
                      <label for="" class="ofbtn">Off</label>
                    </div></td>
              </tr>
              <tr class="firstRow">
                  <td>Cambio de Datacenter</td>
                  <td>1182737434</td>
                  <td>Proceso MFA Claro</td>
                  <td>Exitoso</td>
                  <td>200</td>
                  <td><div class="toggle">
                      <input type="checkbox">
                      <label for="" class="onbtn">On</label>
                      <label for="" class="ofbtn">Off</label>
                    </div></td>
              </tr>
              <tr class="firstRow">
                  <td>Envio de OTP</td>
                  <td>218773467</td>
                  <td>Proceso MFA Claro</td>
                  <td>Exitoso</td>
                  <td>200</td>
                  <td><div class="toggle">
                      <input type="checkbox">
                      <label for="" class="onbtn">On</label>
                      <label for="" class="ofbtn">Off</label>
                    </div></td>
              </tr>
              <tr class="firstRow">
                <td>Cambio de Datacenter</td>
                  <td>10777322</td>
                  <td>Proceso MFA Claro</td>
                  <td>Exitoso</td>
                  <td>200</td>
                  <td><div class="toggle">
                      <input type="checkbox">
                      <label for="" class="onbtn">On</label>
                      <label for="" class="ofbtn">Off</label>
                    </div></td>
              </tr>
          </tbody>
      </table>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'Reportes',
    data() {
      return {
      }
    },
    //created() {
    
    //}
  }
  </script>
  
  <style scoped>
  table{
    width: 80%;
    margin: auto;
    border:1px solid #bbbbbb;
    padding: 20px 0px;
  }
  </style>
  