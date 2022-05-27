<script>
  const NOTECHARLIMIT = 55;

  export let updateNotes = undefined;

  let noteText = '';
  let selectedColour = 'yellow';

  function getTiltValue() {
    return Math.floor(Math.random() * 10);
  }

  function truncateNote(noteMessage) {
    return noteMessage.substr(0, NOTECHARLIMIT) + '...';
  }

  async function handleSubmit() {
    const noteMessage = document.getElementById('note-text').value;

    const note = {
      text:
        noteMessage.length > NOTECHARLIMIT
          ? truncateNote(noteMessage)
          : noteMessage,
      colour: document.getElementById('colour-select').value,
      tilt: getTiltValue(),
    };

    const response = await fetch('/save/note', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      noteText = '';
      updateNotes();
    }
  }
</script>

<div class="form">
  <h1>Fridge Note!</h1>
  <label for="colour-select">
    Choose a colour:
    <select id="colour-select" name="colourSelect" bind:value={selectedColour}>
      <option value="yellow">Yellow</option>
      <option value="pink">Pink</option>
    </select>
  </label>
  <textarea
    id="note-text"
    class="text-field"
    placeholder="Enter note text, more than {NOTECHARLIMIT} chars will be truncated"
    cols="30"
    rows="5"
    bind:value={noteText}
  />
  <button on:click={handleSubmit} class="submit-btn">Make your note!</button>
</div>

<style>
  label {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
  }

  .form {
    flex-grow: 1;
    width: 373px;
    /* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16); */

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 0 20px;
  }

  .form h1 {
    font-family: 'Lobster', cursive;
    color: red;
    font-size: 4rem;
    text-align: center;
  }

  .text-field {
    border: 1px solid #f2f2f2;
    font-size: 1.5rem;
    width: 307px;
    margin: 20px auto;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16);
  }

  .submit-btn {
    width: 134px;
    height: 36px;
    color: #ffffff;
    font-size: 13px;
    font-weight: bold;
    background-color: #0e67f7;
    border: none;
    cursor: pointer;
  }

  .text-field::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #bbbbbb;
    opacity: 1; /* Firefox */
  }

  .text-field:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #bbbbbb;
  }

  .text-field::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #bbbbbb;
  }
</style>
