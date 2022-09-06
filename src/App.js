import { useEffect, useState } from 'react';
import api from './api'

import './App.scss';

function App() {
  const [token, setToken] = useState('')
  const [periodos, setPeriodos] = useState()
  const [acoes, setAcoes] = useState([])
  const [acoesAtivas, setAcoesAtivas] = useState([])
  const [dispach, setDispach] = useState(null)

  const semana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  useEffect(() => {

    api.post('http://localhost:8081/api/login', {
      "username": "admin",
      "password": "seventh"
    }).then((response) => response.data)
      .then((data) => data.login.userToken)
      .then(token => setToken(token))
      .catch(err => {
        console.error('Ocorreu erro: ' + err)
      })
  }, [])

  useEffect(() => {

    async function getPeriods() {
      api.get('api/event-actions/periods', config)
        .then(response => response.data)
        .then(periodos => setPeriodos(periodos.periods))
    }

    async function getActions() {
      api.get('api/event-actions/sources', config)
        .then(response => setAcoes(response.data.sources))
        
    }

    getPeriods().then(e => getActions())

  }, [token])

  useEffect(() => {
    acoes?.map((acao => {
      return (
        getAction(acao.sourceGuid)
      )
    }))
    
  }, [acoes, dispach]) 

  console.log(acoesAtivas)
  function getAction(guidSource) {
    let result
    api.get(`api/event-actions/sources/${guidSource}/actions`, config)
      .then(response => {
        if(acoesAtivas.length > acoes.length){
          setAcoesAtivas([response.data.actions])
        }
        setAcoesAtivas(acoesAtivas => [...acoesAtivas, response.data.actions])
        result = response.data.actions.enabledActions
        if (result){
          let element = document.getElementById(guidSource)
          element.style.backgroundColor = 'rgb(159, 240, 159, 0.8)'
          element.style.boxShadow = 'none'
        }else{
          let element = document.getElementById(guidSource)
          element.style.boxShadow = 'inline'
          element.style.backgroundColor = 'rgb(79, 114, 79, 0.2)'
        }
      })
    }
    
   async function changeStateAction(state, guid){
      api.put(`http://localhost:8081/api/event-actions/sources/${guid}/actions/enabled-actions`,
      
         {"enabled": state },
      config
    )
  }

 async function activeAction(id, state){
    let element = document.getElementById(id)

     setDispach(!dispach)
    console.log('estado dessa merda ',!state)
    if (state){

      await changeStateAction(!state, id)
      
      element.style.backgroundColor = '#9ff09f'
      element.style.boxShadow = 'none'
    }else{
     await  changeStateAction(!state, id)
      element.style.boxShadow = 'inline'
      element.style.backgroundColor = '#4f714f'
      
    }
    setTimeout(()=>{
      window.location.reload(false);
    },2000)
  }

  return (
    <div className="App">
      <h1>Períodos</h1>
      <div className='periods'>
        {periodos ?
          periodos.map((periodo) => {
            return (
              <div className='period' key={periodo.guid}>
                <h3>Nome do período: {periodo.name}</h3>
                <h3>Inicio: {periodo.startTime}</h3>
                <h3>Fim: {periodo.endTime}</h3>
                <div className='days'>
                  <h3 >Dias Ativos</h3>
                  {periodo.daysOfWeek.map((dia) => {
                    return (
                      <h3 className='day' key={dia}>{semana[dia - 1]}</h3>
                      )
                  })}
                </div>
              </div>
            )
          })
          :
          ''}
      </div>
      <h1>Ações</h1>
      <div className='actions'>
        {acoes ?
          acoes.map((action, index) => {
            return (
              console.log(acoesAtivas[index]?.enabledActions),
              <div id={action.sourceGuid} onClick={e=>activeAction(action.sourceGuid, acoesAtivas[index]?.enabledActions)} className={'action'} key={action.sourceGuid}>
                <div className='condition'>
                  <h3>Status : {acoesAtivas[index]?.enabledActions ? 'Ativo' : "Inativo"}</h3>
                  <h2>Condições</h2>
                  <h3>Evento : {action.eventName}</h3>
                  <h3>Período : {action.periodName}</h3>
                  <h3>Servidor : {(action.serverName ? action.serverName : 'Todos Servidores')}</h3>
                </div>
                <div className='parallel'></div>
                <div className='actionsExecuting'>
                  <h2>Ações que serão executadas</h2>
                  <ul>
                    {<li className={acoesAtivas[index]?.playSound ? 'true' : 'none'}> {acoesAtivas[index]?.playSound ? 'playSound' : ''}</li>}
                    {<li className={acoesAtivas[index]?.relayControl ? 'true' : 'none'}> {acoesAtivas[index]?.relayControl ? 'relayControl' : ''}</li>}
                    {<li className={acoesAtivas[index]?.sendEmail ? 'true' : 'none'}> {acoesAtivas[index]?.sendEmail ? 'sendEmail' : ''}</li>}
                    {<li className={acoesAtivas[index]?.cameraSnapshot ? 'true' : 'none'}> {acoesAtivas[index]?.cameraSnapshot ? 'cameraSnapshot' : ''}</li>}
                    {<li className={acoesAtivas[index]?.openLayout ? 'true' : 'none'}> {acoesAtivas[index]?.openLayout ? 'dynamicLayout' : ''}</li>}
                    {<li className={acoesAtivas[index]?.activatePreset ? 'true' : 'none'}> {acoesAtivas[index]?.activatePreset ? 'activatePreset' : ''}</li>}
                    {<li className={acoesAtivas[index]?.controlRecording ? 'true' : 'none'}> {acoesAtivas[index]?.controlRecording ? 'controlRecording' : ''}</li>}
                    {<li className={acoesAtivas[index]?.switchPreviewStream ? 'true' : 'none'}> {acoesAtivas[index]?.switchPreviewStream ? 'switchPreviewStream' : ''}</li>}
                    {<li className={acoesAtivas[index]?.switchRecordingStream ? 'true' : 'none'}> {acoesAtivas[index]?.switchRecordingStream ? 'switchRecordingStream' : ''}</li>}
                    {<li className={acoesAtivas[index]?.changeProfile ? 'true' : 'none'}> {acoesAtivas[index]?.changeProfile ? 'changeProfile' : ''}</li>}
                    {<li className={acoesAtivas[index]?.activateLPR ? 'true' : 'none'}> {acoesAtivas[index]?.activateLPR ? 'activateLPR' : ''}</li>}
                    {<li className={acoesAtivas[index]?.controlAudio ? 'true' : 'none'}> {acoesAtivas[index]?.controlAudio ? 'controlAudio' : ''}</li>}
                    {<li className={acoesAtivas[index]?.sendSMS ? 'true' : 'none'}> {acoesAtivas[index]?.sendSMS ? 'sendSMS' : ''}</li>}
                    {<li className={acoesAtivas[index]?.monitorSnapshot ? 'true' : 'none'}> {acoesAtivas[index]?.monitorSnapshot ? 'monitorSnapshot' : ''}</li>}
                    {<li className={acoesAtivas[index]?.sendHTTPRequest ? 'true' : 'none'}> {acoesAtivas[index]?.sendHTTPRequest ? 'sendHTTPRequest' : ''}</li>}
                    {<li className={acoesAtivas[index]?.snepCall ? 'true' : 'none'}> {acoesAtivas[index]?.snepCall ? 'snepCall' : ''}</li>}
                    {<li className={acoesAtivas[index]?.contactId ? 'true' : 'none'}> {acoesAtivas[index]?.contactId ? 'contactId' : ''}</li>}
                    {<li className={acoesAtivas[index]?.situator ? 'true' : 'none'}> {acoesAtivas[index]?.situator ? 'situator' : ''}</li>}
                    {<li className={acoesAtivas[index]?.recordBookmark ? 'true' : 'none'}> {acoesAtivas[index]?.recordBookmark ? 'recordBookmark' : ''}</li>}
                    {<li className={acoesAtivas[index]?.virtualPatrol ? 'true' : 'none'}> {acoesAtivas[index]?.virtualPatrol ? 'virtualPatrol' : ''}</li>}
                    {<li className={acoesAtivas[index]?.sendPushNotification ? 'true' : 'none'}> {acoesAtivas[index]?.sendPushNotification ? 'sendPushNotification' : ''}</li>}
                  </ul>
                </div>
              </div>
            )
          })
          :
          ''}
      </div>

    </div>
  );
}

export default App;
