function close_modal(){$("#mask").fadeOut(500),$(".modal_window").fadeOut(500)}function show_modal(o){$("#mask").css({display:"block",opacity:0}),$("#mask").fadeTo(500,.8),$("#"+o).fadeIn(500)}$(document).ready(function(){var o=$(window).width(),a=$(window).height();$(".modal_window").each(function(){var t=$(this).outerHeight(),i=$(this).outerWidth(),d=(a-t)/2,c=(o-i)/2;$(this).css({top:d,left:c})}),$(".activate_modal").click(function(){var o=$(this).attr("name");show_modal(o)}),$(".close_modal").click(function(){close_modal()})});