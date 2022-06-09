var cfg = {

	route: '',
	
	tooltip: {
		selector: '[data-tooltip=true]',
		container: 'body'
	},

	numeric: {
		decimal: ".",
		negative: false
	},

	switchery: {
		color: '#46be8a',
		jackColor: '#ffff'
	},

	tabledragger: {
		mode: 'row',
		dragHandler: '.handle',
		onlyBody: true,
		animation: 300
	},

	datepicker: {
		language: 'es',
		startDate: new Date(),
		autoclose: true
	},

	datepicker_lang: {
		'es': {
			days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
			daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
			daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
			months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			today: "Hoy",
			clear: "Borrar",
			format: "dd/mm/yyyy",
			titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
			weekStart: 1
		}
	},

	timepicker: {
		'showDuration': true,
		'autoclose': true,
		'timeFormat': 'H:i'
	},

	datetimepicker: {
		lang: 'es',
		dayOfWeekStart: 1,
		datepicker: true,
		timepicker: true,
		format: 'd/m/Y H:i',
		step: '60',
	},

	dropify: {
		messages: {
			'default': 'Arrastra un archivo o haz click aquí',
			'replace': 'Arrastra una imagen o haz click para remplazar',
			'remove': '<i class="icon wb-close" aria-hidden="true"></i>',
			'error': 'Vaya, algo ha ido mal.'
		},
		error: {
			'fileSize': 'El archivo es demasiado pesado (Máximo {{ value }}).',
			'minWidth': 'El ancho de la imagen es muy pequeño (Mínimo {{ value }}px).',
			'maxWidth': 'El ancho de la imagen es muy grande (Máximo {{ value }}px).',
			'minHeight': 'El alto de la imagen es muy pequeño (Mínimo {{ value }}px).',
			'maxHeight': 'El alto de la imagen es muy grande (Máximo {{ value }}px).',
			'imageFormat': 'Formato no válido (Solo: {{ value }}).',
			'fileExtension': 'Tipo de archivo no aceptado (Solo: {{ value }}).',
		}
	},

	toastr: {
		escapeHtml: false,
		newestOnTop: true,
		preventDuplicates: false,
		positionClass: 'toast-top-center',
		timeOut: 7000,
		extendedTimeOut: 10000,
		showMethod: 'slideDown',
		showEasing: 'swing',
		closeButton: true,
		closeMethod: 'fadeOut',
		closeEasing: 'swing',
		closeDuration: 300,
		hideMethod: 'fadeOut',
		hideEasing: 'swing',
	},

	footable: {
		empty: 'No se encontraron resultados.',
		showToggle: false,
		stopPropagation: true,
		editing: {
			enabled: false,
		},
		filtering: {
			enabled: true,
			container: '#footable-filering-container',
			dropdownTitle: 'Buscar en:',
			ignoreCase: true,
			min: 2,
			placeholder: 'Búsqueda rápida...',
			position: 'right',
		},
		paging: {
			enabled: true,
			container: '#footable-paging-container',
			countFormat: 'Página {CP} de {TP}',
			limit: 5,
			position: 'right',
		},
		sorting: {
			enabled: true,
		},
		on: {
			'after.ft.paging': function (e, ft) {
				app.lists.footablePatch();
			},
			'ready.ft.table': function (e, ft) {
				app.lists.footablePatch();
			},
			'after.ft.filtering': function (e, ft) {
				app.lists.footablePatch();
			}
		}
	},
	
	summernote_basic: {
		lang: 'es-ES',
		height: 150,
		maxHeight: 200,
		disableDragAndDrop: true,
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['insert', ['link']]
		],
		callbacks: {
			onPaste: function (e) {
				var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
				e.preventDefault();
				document.execCommand('insertText', false, bufferText);
			}
		}
	},

	summernote_full: {
		lang: 'es-ES',
		height: 500,
		disableDragAndDrop: true,
		toolbar: [
			['undo', ['undo', 'redo']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['fontsize', 'color']],
			['paragraph', ['style', 'paragraph']],
			['lists', ['ul', 'ol']],
			['insert', ['link', 'picture', 'video']],
			['code', ['codeview']]
		],
		callbacks: {
			onPaste: function (e) {
				var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
				e.preventDefault();
				document.execCommand('insertText', false, bufferText);
			}
		}
	},

	fileupload: {
		url: "documents/upload",
		formData: {}, //rellenar en specif js para pasarle la validación específica
		multiple: true,
		fileName: "fileupload[]",
		showAbort: false,
		showFileSize: false,
		showPreview: false,
		showDelete: true,
		dragDropStr: "<span>&nbsp;o arrástralos aquí.</span>",
		cancelStr: "cancelar",
		deletelStr: "<i class='fa fa-close' aria-hidden='true'></i>",
		uploadStr: "Selecciona uno o varios archivos",
		previewHeight: "auto",
		previewWidth: "100px",
		statusBarWidth: "auto",
		dragdropWidth: "auto",
		uploadButtonClass: "btn btn-outline btn-dark",
		showFileCounter: false,
		showStatusAfterSuccess: false,
		onSuccess: function (files, data, xhr, pd) {
		},
		afterUploadAll: function (data) {
		},
		onError: function (files, status, message, pd) {
			app.alerts.show({type: 'critical'});
		},
		deleteCallback: function (data, pd) {
		}
	},
	
	fileupload_single: {
		url: "documents/upload",
		formData: {}, //rellenar en specif js para pasarle la validación específica
		multiple: false, //multiple drag and drop
		maxFileCount: 1, //max files
		maxFileCountErrorStr: " no está permitido. El número máximo de archivos que se pueden subir es: ",
		fileName: "fileupload",
		showAbort: false,
		showFileSize: false,
		showPreview: true,
		showDelete: true,
		dragDropStr: "<span>&nbsp;o arrástralo aquí.</span>",
		cancelStr: "cancelar",
		deletelStr: "<i class='fa fa-close red' aria-hidden='true'></i>",
		uploadStr: "Selecciona un archivo",
		previewHeight: "auto",
		previewWidth: "100px",
		statusBarWidth: "auto",
		dragdropWidth: "auto",
		uploadButtonClass: "btn btn-outline btn-dark",
		showFileCounter: false,
		showStatusAfterSuccess: true,
		onLoad: function (obj) {
		},
		onSuccess: function (files, data, xhr, pd) {
		},
		afterUploadAll: function (data) {
		},
		onError: function (files, status, message, pd) {
			app.alerts.show({type: 'critical'});
		},
		deleteCallback: function (data, pd) {
		}
	},

};