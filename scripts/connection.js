/**
 * Function that open or close the modal of connection
 * 
 * @param {boolean} opened True if the modal is already opened
 */
function openConnectionModal(opened = false){
    // if the modal is aleady opened we close it
    if(opened){
        // reload connection
        document.getElementById('connection').innerHTML = connectionHTML;

        // undisplay modal
        document.getElementById('modal_connection').style.display = 'none';

    // If the modal is not open
    } else {
        // change the button
        document.getElementById('connection_button').setAttribute('onclick', 'openConnectionModal(true);')

        // change background button
        document.getElementById('connection_button').style.backgroundColor = 'white';

        // open_modal
        document.getElementById('modal_connection').style.display = 'block';
    }
}