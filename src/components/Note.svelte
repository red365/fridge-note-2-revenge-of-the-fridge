<script>
  export let note;
  export let updateNotes = undefined;

  let fade = false;

  function tiltNote(tiltAmount) {
    const tiltLeft = amount => 'rotate(' + (360 - amount) + 'deg)';
    const tiltRight = amount => 'rotate( ' + amount + 'deg)';

    return tiltAmount < 5 ? tiltLeft(tiltAmount) : tiltRight(tiltAmount);
  }

  function deleteNote(id) {
    fade = true;
    console.log('triggering set time out');
    // Avoid overlap of fade out and note update
    setTimeout(() => {
      console.log('DELETING NOTE');
      fetch('/delete/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      }).then(res => {
        updateNotes();
      });
    }, 3000);
  }
</script>

<div
  class="note {note.colour}"
  class:fade
  style="transform: {tiltNote(note.tilt)};"
>
  <div class="delete-icon">
    <i on:click={() => deleteNote(note._id)} class="fas fa-times" />
  </div>
  <div class="note-message">
    <p>{note.text}</p>
  </div>
</div>

<style>
  .note {
    display: flex;
    flex-direction: column;
    height: 268px;
    width: 230px;
    padding-left: 30px;
    padding-right: 10px;
    padding-bottom: 25px;
    padding-top: 7px;
    box-sizing: border-box;
    margin: 7px;
    font-family: 'Covered By Your Grace';
    font-size: 2rem;
  }

  .fa-times {
    color: #999;
    margin-top: 7px;
    margin-bottom: 5px;
    font-size: 1rem;
    cursor: pointer;
    opacity: 0.2;
  }

  .delete-icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .note-message {
    display: flex;
    flex-direction: row;
  }

  .yellow {
    background-image: url('/static/assets/yellow-note.png');
  }

  .pink {
    background-image: url('/static/assets/pink-note.png');
  }

  .fade {
    animation-name: fade-out;
    animation-duration: 3s;
    opacity: 0;
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
