<script>
  import Fridge from './components/Fridge';
  import SidePanel from './components/SidePanel';

  let notesPromise = getNotes();

  function getNotes() {
    return fetch('/get/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  }

  const updateNotes = () => {
    notesPromise = getNotes();
  };
</script>

<div id="body">
  <SidePanel {updateNotes} />
  {#await notesPromise}
    <Fridge />
  {:then notes}
    <Fridge {notes} {updateNotes} />
  {/await}
</div>

<style>
  #body {
    max-width: 1920px;
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    margin: 0 auto;
  }
</style>
