var app = {
	
	init: function () {
		
		// Añadir CSFR Token a todas las peticiones Ajax
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		
		app.widgets.init();
		app.lists.init();
		app.forms.init();
		app.notifications.init();
		
	},
	
	widgets: {
		
		init: function () {
			
			// Tooltip setup
			$(document).tooltip(cfg.tooltip);
			try {
				$('[data-toggle="tooltip"]').each(function () {
					$(this).attr('title', $(this).attr('data-original-title'));
				});
				$('[data-toggle="tooltip"]').tooltip('dispose');
			} catch (e) {}
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover();

			// Numeric
			$("input.numeric").numeric(cfg.numeric);

			// Switchery estado
			var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
			if (elems) {
				elems.forEach(function (html) {
					var switchery = new Switchery(html, cfg.switchery);
				});
			}

			// Table Dragger
			var el = document.querySelector('table.reorder-row');
			if (el) {
				var dragger = tableDragger(el, cfg.tabledragger);
				dragger.on('drop', function (from, to) {
					app.lists.setOrder();
				});
			}
			
			// DatePicker
			$.fn.datepicker.dates['es'] = cfg.datepicker_lang['es'];
			$('.datepicker').datepicker(cfg.datepicker);
			
			// Datepicker desde-hasta
			$('.datepair-date').datepicker({
				language: 'es',
				autoclose: true
			}).on('changeDate', function (e) {
				var input = $(this);
				if ($(input).hasClass('datepair-start')) {
					//Cambiar datepair-end para que sólo se puedan seleccionar fechas a partir de datepair-start
					var fechadesde = $(".datepair-start").val();
					fechadesde = fechadesde.split("/");
					fechadesde = fechadesde[1] + "-" + fechadesde[0] + "-" + fechadesde[2];
					$(".datepair-end").datepicker("setStartDate", new Date(fechadesde));
				}
			});
			
			// Timepicker
			$('.datepair-time').timepicker(cfg.timepicker);
			
			// Datetimepicker
			$.datetimepicker.setLocale('es');
			$('input.datetimepicker').each(function () {
				$(this).datetimepicker(cfg.datetimepicker);
			});
			$('.datetimepickerlaunch').each(function () {
				$(this).on('click', function () {
					$($(this).attr('data-target')).show().focus();
				});
			});
			
			// Dropify
			// https://github.com/JeremyFagis/dropify
			var drEvent = $('.dropify').dropify(cfg.dropify);
			drEvent.on('dropify.afterClear', function(event, element) {
				$('input[name="' + element.input[0].name + '_delete"]').val(1);
			});
			
			// Summernote
			$('.summernote-basic').summernote(cfg.summernote_basic);
			
			$('.summernote-full').summernote(cfg.summernote_full);
			
			// Hack summernote (cambio pestañas)
			$('ul.nav-tabs a').on('click', function() {
				$('.note-toolbar-wrapper').removeAttr('style');
				$('.note-toolbar').removeAttr('style');
			});
			
			// SelectPicker
			$('.selectpicker').selectpicker();

			// Select2
			$('select.select2').select2();
			
			// Slugs
			$('.to-slug').each(function () {
				var target = $(this).attr('data-target');
				$(this).on('keyup blur', function () {
					$(target).val(app.utils.createSlug($(this).filteredVal()));
				});
			});
			
		} //init widgets
	}, //end widgets
	
	lists: {
		
		cfg: {},

		init: function () {
			
			var th;

			if (typeof app.lists.cfg.mode !== 'undefined') {

				if (app.lists.cfg.mode == 'laravel') {

					$('table.items-list').addClass('footable-disabled');

				} else if (app.lists.cfg.mode == 'footable') {

					cfg.footable.paging.size = app.lists.cfg.pagesize;
					$('th[data-name="' + app.lists.cfg.orderBy + '"]').attr('data-sorted', 'true');
					$('th[data-name="' + app.lists.cfg.orderBy + '"]').attr('data-direction', app.lists.cfg.order.toUpperCase());

					$('table.items-list').addClass('footable-enabled').footable(cfg.footable);
					app.lists.footablePatch();

				}

			}
			
			app.lists.activation.init();
			app.lists.remove.init();
			app.lists.search.init();
			
		},

		footablePatch: function () {
			// Reinicio de eventos para parchear footable
			
			// Tooltip setup
			try {
				$('[data-toggle="tooltip"]').each(function () {
					$(this).attr('title', $(this).attr('data-original-title'));
				});
				$('[data-toggle="tooltip"]').tooltip('dispose');
			} catch (e) {

			}
			$('[data-toggle="tooltip"]').tooltip();
			
			app.lists.activation.init();
			
		},
		
		activation: {

			init: function () {

				if ($('table.footable-enabled').length > 0) {
					// Switchery estado
					// Eliminamos las instancias existentes (patch para footable)
					$('span.switchery').remove();
					$('input.js-switch').unbind('change');
					var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
					if (elems) {
						elems.forEach(function (html) {
							var switchery = new Switchery(html, cfg.switchery);
						});
					}
				}

				$('table.items-list .js-switch').each(function () {
					$(this).on('change', function (e) {
						app.lists.activation.click($(this));
					});
				});

			},
			
			click: function (check) {
				
				var check_id = check.attr('id'),
					path = check.attr('data-path');
				
				app.lists.activation.disable(check_id);
				
				$.ajax({
					url: path,
					method: 'POST',
					dataType: 'json',
					accepts: 'json',
					timeout: 15000,
					data: {
						active: check.is(':checked') ? 1 : 0
					},
					success: function (response, textStatus, jqXHR) {
						
						if (response.result == "ok") {
							
							app.notifications.launch({
								'type': 'success',
								'text': response.msg
							});
							
						} else if (response.result == "error") {
							
							app.alerts.show({
								type: 'error', 
								text: data.msg
							});
							
						}
						app.lists.activation.enable(check_id);
						
					},
					error: function (jqXHR, textStatus, errorThrown) {
						
						app.alerts.show({type: 'critical'});
						
					}
				});
				
			},
			
			disable: function (id) {
				
				var check = $('#' + id);
				var sw = check.parent().find('.switchery');
				// Desactivar switch
				sw.find('small').html('<i class="fa fa-cog fa-spin fa-2x"></i>');
				sw.addClass('switchery-disabled');
				
			},
			
			enable: function (id) {
				
				var check = $('#' + id);
				var sw = check.parent().find('.switchery');
				// Activar switch
				sw.find('small').html('');
				sw.removeClass('switchery-disabled');
				
			}
			
		},
		
		remove: {
			
			init: function () {

				$('body').on('click', 'table.items-list a.delete:not([disabled])', function (e) {
					e.preventDefault();
					app.lists.remove.ask($(this));
				});

			},

			ask: function (item) {
				
				app.alerts.show({
						type: 'confirm',
						text: '<h4>' + item.attr('data-text') + '</h4><p>Esta acción no puede deshacerse.</p>',
						options: {
							primary_callback: function () {
								app.lists.remove.action(item);
							}
						}
					});
				
			},
			
			action: function (item) {
				
				app.utils.screenLock();
				
				$.ajax({
					method: "POST",
					url: item.attr('data-path'),
					data: {},
					accepts: 'json',
					dataType: 'json',
					success: function (data) {
						
						app.utils.screenUnlock();
						
						if (data.result == 'ok') {
							
							// Delete row table
							$('[data-itemid="' + data.id + '"]').remove();
							$('table.footable-enabled').footable({
								empty: 'No se encontraron resultados.'
							});
							
							app.notifications.launch({
								'type': 'success',
								'text': data.msg
							});
							
						} else if (data.result == 'error') {
							
							app.alerts.show({
								type: 'error', 
								text: data.msg
							});
							
						}
						
					},
					error: function (data) {
						app.utils.screenUnlock();
						app.alerts.show({type: 'critical'});
					}
				})
				
			}
			
		},

		search: {

			init: function () {

				// Búsqueda avanzada

				// Desplegar/plegar formulario de búsqueda avanzada
				$('.advanced-search-button button').click(function () {
					var target = $(this).attr('data-target');
					if ($(target).is(':visible')) {
						$(target).slideUp();
						$(this).find('i').css('transform', 'rotate(0deg)');
					} else {
						setTimeout(function () {
							$('.advanced-search-panel select.select2').select2();
						}, 200);
						$(target).slideDown();
						$(this).find('i').css('transform', 'rotate(180deg)');
					}
				});

				// Botón reset
				$('.advanced-search-panel button[type="reset"]').on('click', app.lists.search.reset);

				// Combos de listado
				$('.list-filter select').each(function () {

					$(this).on('change', function() {
						var filtering = FooTable.get($(this).attr('data-table')).use(FooTable.Filtering), // get the filtering component for the table
							filter = $(this).val(); // get the value to filter by
						if (filter === 'all') { // if the value is "none" remove the filter
							filtering.removeFilter('filter');
						} else { // otherwise add/update the filter.
							filtering.addFilter('filter', filter, [$(this).attr('data-column')]);
						}
						filtering.filter();
					});

				});

			},

			reset: function () {

				$('form.advanced-search-form').find("input, textarea, select").not('input[type="hidden"]').val('').attr('value', '');
				
				$('select.select2').each(function () {
					$(this).val('').trigger('change');
				});

				$('form.advanced-search-form').find("select option[selected]").each(function () {
					
					//Si es IE
					if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
						var id = $(this).filteredVal();
						var name = $(this).text();
						var newOption = '<option value="' + id + '">' + name + '</option>';
						$(this).replaceWith(newOption);
					}
					
					$(this).prop('selected', false);
					$(this).removeAttr('selected');

				});
				
				$('.datepair-date input').each(function () {
					$(this).attr('value', '').datepicker('update', '');
				});

			},

		},
		
		setOrder: function () {
			
			var t = [];
			
			$('table.reorder-row tr.handle').each(function (i) {
				
				var id = $(this).attr('data-itemid');
				$(this).find('strong.order').text(i + 1);
				t.push(id);
				
			});
			
			$('input[name="list_order"]').val(t.join(','));
			
		}
		
	},//end lists
	
	forms: {
		
		init: function () {
			
			// Forzamos el evento del jQuery Validation plugin para bloquear la pantalla
			// en caso de éxito en la validación
			if ($('form.form-validation').length > 0 && $.validator) {
				$.validator.setDefaults({
					submitHandler: function (form) {
						app.utils.screenLock();
						form.submit();
					}
				});
			} else {
				$('form').on('submit', app.utils.screenLock);
			}
			
			app.forms.locales.init();
			
		},
		
		locales: {
			
			init: function() {
				
				app.forms.locales.check();
				
				$('div.locale-tabs div.tab-pane input, div.locale-tabs div.tab-pane textarea:not(.summernote)').on('blur', app.forms.locales.check);
				
				$('div.locale-tabs div.tab-pane textarea.summernote').each(function() {
					$(this).on('summernote.blur', app.forms.locales.check);
				});
				
			},
			
			check: function() {
				
				var nav;
				
				$('div.locale-tabs div.tab-pane').each(function() {
				
					var ok = false;
					
					$(this).find('[name]').each(function() {
						
						if ($(this).hasClass('summernote')) {
							
							if (!$(this).summernote('isEmpty')) {
								ok = true;
							}
						
						} else {
							
							if ($(this).filteredVal() != '') {
								ok = true;
							}
							
						}
						
					});
					
					nav = $('div.locale-tabs ul.nav-tabs a[href="#'+$(this).attr('id')+'"] i');
					
					if (!ok) {
					
						nav.removeClass('ok fa-check')
							.addClass('notok fa-exclamation-triangle');
					
					} else {
						
						nav.removeClass('notok fa-exclamation-triangle')
							.addClass('ok fa-check');
					
					}
				
				});
				
			}
			
		}
		
	},//end forms
	
	// Sistema de modales de alertas
	// Usa los modales de Bootstrap
	// Opciones:
	// width: ancho del modal distinto del default (sm, lg, xl)
	// locked: true/false, permite que se cierre haciendo click fuera o no
	// show_title: true/false, muestra el title del modal
	// show_close: true/false, muestra el botón de cerrar o no
	// primary_button_text: Texto del botón principal
	// secondary_button_text: Texto del botón secundario
	// primary_callback: Callback del botón principal
	// secondary_callback: Callback del botón secundario
	alerts: {
		
		show: function (options) {
			
			$('#modal-alert').remove();

			var type = typeof options.type !== 'undefined' ? options.type : 'alert',
				title = typeof options.title !== 'undefined' ? options.title : 'Error',
				text = typeof options.text !== 'undefined' ? options.text : 'Esto es un aviso.',
				options = typeof options.options !== 'undefined' ? options.options : {};
			
			var width = typeof options.width === 'undefined' ? '' : ' modal-' + width,
				primary_button_text = typeof options.primary_button_text === 'undefined' ? 'Aceptar' : options.primary_button_text,
				secondary_button_text = typeof options.secondary_button_text === 'undefined' ? 'Cancelar' : options.secondary_button_text,
				modal_body = text, 
				modal_buttons = '<button type="button" class="btn btn-primary" data-dismiss="modal">' + primary_button_text + '</button>';

			switch (type) {
			
				// Mensaje de error genérico
				case 'error':
					modal_body = '<div class="modal-icon"><i class="fa fa-exclamation-triangle"></i></div>'
											+ '<div class="modal-icon-text">' + text + '</div>';
					break;
				
				// Mensaje de error crítico
				case 'critical':
					title = 'Oooops!';
					modal_body = '<div class="modal-icon"><i class="fa fa-frown-o"></i></div>'
											+ '<div class="modal-icon-text">Vaya, parece que ha sucedido un error inesperado. Por favor, refresca la página y vuelve a intentarlo.</div>';
					break;
				
				// Modal de confirmación
				case 'confirm':
					options.show_title = false;
					modal_body = '<div class="modal-icon"><i class="fa fa-question-circle"></i></div>'
											+ '<div class="modal-icon-text">' + text + '</div>';
					modal_buttons = '<button type="button" class="btn btn-secondary" data-dismiss="modal">' + secondary_button_text + '</button>'
												+ '<button type="button" class="btn btn-primary" data-dismiss="modal">' + primary_button_text + '</button>';
					break;

				// Mensaje genérico
				default:
					options.show_title = false;
					break;
				
			}

			var html = '<div id="modal-alert" class="modal fade"';
			if (typeof options.locked === 'undefined' || options.locked) {
				html += ' data-backdrop="static" data-keyboard="false"';
			}
			html += ' tabindex="-1" role="dialog">'
								+ '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable' + width + ' modal-type-' + type + '">'
								+ '<div class="modal-content">';
			if (typeof options.show_title === 'undefined' || options.show_title) {
				html += '<div class="modal-header">'
								+ '<h5 class="modal-title">' + title + '</h5>';
				if (typeof options.show_close === 'undefined' || options.show_close) {
					html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>';
				}
				html += '</div>';
			}

			html += '<div class="modal-body">' + modal_body + '</div>';
			html += '<div class="modal-footer">' + modal_buttons + '</div>';

			html += '</div></div></div>';

			$('body').append(html);

			if (typeof options.primary_callback !== 'undefined') {
				$('#modal-alert .modal-footer button.btn-primary').on('click', options.primary_callback);
			}
			if (typeof options.secondary_callback !== 'undefined') {
				$('#modal-alert .modal-footer button.btn-secondary').on('click', options.secondary_callback);
			}

			$('#modal-alert').modal();
			
		}
		
	},
	
	notifications: {
		
		queue: [],
		
		init: function () {
			
			app.notifications.show();

		},

		add: function (options) {
			
			var type = typeof options.type !== 'undefined' ? options.type : 'info',
				text = typeof options.text !== 'undefined' ? options.text : 'Notificación';
			
			app.notifications.queue.push({
				'type': type,
				'text': text
			});
			
		},
		
		show: function (options) {
			
			// Toastr options
			toastr.options = cfg.toastr;
			
			for (var i in app.notifications.queue) {
				
				toastr[app.notifications.queue[i].type](app.notifications.queue[i].text);
				
			}
			
		},
		
		launch: function (options) {
			
			toastr[options.type](options.text);
			
		}
		
	}, //end notifications
	
	utils: {
		
		screenLock: function () {
			
			$('body').append('<div class="screenLock"><p><i class="fa fa-cog fa-spin fa-fw"></i></p></div>')
			
		},
		
		screenUnlock: function () {
			
			$('div.screenLock').remove();
			
		},
		
		createSlug: function (str) {
			
			str = str.replace(/^\s+|\s+$/g, ""); // trim
			str = str.toLowerCase();
			
			// remove accents, swap ñ for n, etc
			var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
			var to = "aaaaaaeeeeiiiioooouuuunc------";
			
			for (var i = 0, l = from.length; i < l; i++) {
				str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
			}
			
			str = str
				.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
				.replace(/\s+/g, "-") // collapse whitespace and replace by -
				.replace(/-+/g, "-"); // collapse dashes
			
			return str;
			
		},
		
	}, //end aux
	
	
};

$(document).ready(function () {
	
	// Iniciar template remark
	var Site = window.Site;
	Site.run();
	
	// Iniciar app
	app.init();
	
});

$.fn.filteredVal = function () {
	
	var value = $(this).val();
	
	if (typeof value !== "undefined") {
		
		var lt = /</g,
			gt = />/g,
			ap = /'/g,
			ic = /"/g;
		
		value = value.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
		
	}
	
	return value;
	
}