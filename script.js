var toastCounter = 1;

$('button').on('click', function() {
    displayToastNotification("", icon, icon_color, animation);
});

function displayToastNotification( msg, icon, icon_color, animation ) {
	var class_name = 'toast-'+toastCounter;
	var new_node;

	new_node = $('.master-toast-notification').clone().appendTo('.toasts').addClass(class_name + ' toast-notification').removeClass('master-toast-notification');
	new_node.find('.toast-msg').text(msg);
	new_node.find('.toast-icon i').addClass(icon);
	new_node.find('.toast-icon').addClass('wiggle-me').css('background-color', icon_color);
	new_node.removeClass('hide-toast').addClass(animation);
	setTimeout(function() {
		new_node.remove();
	}, 3800);
	toastCounter++;
}