$(document).ready(() => {
    const socket = io();
    $("#modal-button").click(() => {
      $(".modal-body").html("");
      // let apiToken = $("#apiToken").data("token");
      // $.get(`/api/courses?apiToken=${apiToken}`, (results = {}) => {
      $.get(`/api/courses`, (results = {}) => {
        let data = results.data;
        if(!data || !data.courses) return;
        data.courses.forEach((course) => {
          $('.modal-body').append(
            `<div>
              <span class="course-title">
                ${course.title}
              </span>
              <button class='${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
                ${course.joined ? "Joined" : "Join"}
              </button>
              <div class="course-description">
                ${course.description}
              </div>
            </div>` 
          );
        });
      }).then(() => {
        addJoinButtonListener();
      });
    });

    $("#chatForm").submit(() => {
      let text = $('#chat-input').val(),
        userId = $('#chat-user-id').val(),
        userName = $('#chat-user-name').val();
      socket.emit('message', {
        content: text,
        userId: userId,
        userName: userName
      });
      $('#chat-input').val('');
      return false;
    });

    socket.on('message', (message) => {
      displayMessage(message);
      for(let i=0; i<2; i++){
        $('.chat-icon').fadeOut(200).fadeIn(200);
      }
    });
  
    socket.on('load all messages', (data) => {
      data.forEach(message => {
        displayMessage(message);
      });
    });
  
    socket.on('user disconnected', () => {
      displayMessage({
        userName: 'Notice',
        content: 'User left the chat'
      });
    })

  });

  let addJoinButtonListener = () => {
    $(".join-button").click((event) => {
      let $button = $(event.target),
        courseId = $button.data("id");
      $.get(`/api/courses/${courseId}/join`, (results = {}) => {
        let data = results.data;
        if(data && data.success){
          $button
            .text('Joined')
            .addClass('joined-button')
            .removeClass('join-button');
        }else{
          $button.text('Try again');
        }
      });
    });
  }

  let displayMessage = (message) => {
    $('#chat').prepend($('<li>').html(`
    <strong class="message ${getCurrentUserClass(message.user)}">
      ${message.userName}
    </strong>: ${message.content}
    `));
  };
  let getCurrentUserClass = (id) => {
    let userId = $('#chat-user-id').val();
    return userId === id ? 'current-user': '';
  }

