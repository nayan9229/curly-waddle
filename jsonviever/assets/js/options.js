function initOptions() {
    var bgPage = chrome.extension.getBackgroundPage();
    var options = localStorage.options ? JSON.parse(localStorage.options) : {};
    var safeMethodInput = document.getElementById('safeMethodInput');
    var injectInFrameInput = document.getElementById('injectInFrameInput');
    var addContextMenuInput = document.getElementById('addContextMenuInput');

    safeMethodInput.checked = options.safeMethod;
    injectInFrameInput.checked = options.injectInFrame;
    addContextMenuInput.checked = options.addContextMenu;

    safeMethodInput.addEventListener('change', function () {
        options.safeMethod = safeMethodInput.checked;
        localStorage.options = JSON.stringify(options);
    });
    injectInFrameInput.addEventListener('change', function () {
        options.injectInFrame = injectInFrameInput.checked;
        localStorage.options = JSON.stringify(options);
    });
    addContextMenuInput.addEventListener('change', function () {
        options.addContextMenu = addContextMenuInput.checked;
        localStorage.options = JSON.stringify(options);
        bgPage.refreshMenuEntry();
    });
    document.getElementById('open-editor').addEventListener(
        'click',
        function () {
            location.href = 'css-editor.html';
        },
        false
    );
}

addEventListener('load', initOptions, false);
