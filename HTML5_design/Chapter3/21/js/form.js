function OrderInput (opts) {
    this.$list = opts.$list;

    this.initSortable();
    this.initInput();
    this.initAddBtn();

    this.updateInput();
}

// jQuery UIのSortableを初期化・イベント設定
OrderInput.prototype.initSortable = function () {
    var self = this;
    var $list = this.$list;

    $list.sortable({
        update: function () {
            self.updateInput();
        }
    });
};

// input要素の取得
OrderInput.prototype.initInput = function () {
    var $list = this.$list;

    var orderName = $list.attr('data-order-name');
    if (!orderName) {
        console.error('OrderInputのためのinput要素が見つかりません。');
        return;
    }

    var $input = $('input[name="' + orderName + '"]');
    this.$input = $input;
};

// 「追加する」ボタンの用意
OrderInput.prototype.initAddBtn = function () {
    var $addBtn = $('<input type="button" value="追加"/>');

    var self = this;
    $addBtn.on('click', function () {
        var name = window.prompt('メンバー名');
        if (!name) {
            return;
        }
        self.add(name);
    });

    this.$list.before($addBtn);
    this.$addBtn = $addBtn;
};

// Sortableに要素追加
OrderInput.prototype.add = function (name) {
    var $list = this.$list;
    $list.prepend($(['<li>', name, '</li>'].join('')));

    this.updateInput();
};

// Sortableの順番をinput要素の値に反映させる
OrderInput.prototype.updateInput = function () {
    var $list = this.$list;
    var $input = this.$input;

    if (!$input) {
        return;
    }

    var items = [];
    $list.children().each(function () {
        var $item = $(this);
        items.push($item.attr('data-order-value') || $item.text());
    });
    $input.val(items.join(','));

    $input.change();
};

function FileInput (opts) {
    // input要素(jQueryオブジェクトの状態でも保持しておく)
    var input = opts.input;
    var $input = $(input);


    // ===================================================================
    // 選択したファイルのプレビュー機能
    // ===================================================================

    // プレビューとして表示するためのimg要素を用意
    var $img = $('<img />').attr({
        'class': 'form__preview',
        src: 'img/noimage.gif',
        alt: 'プレビュー'
    });
    $input.after($img);

    // この機能は、FileReader(File API)が使えるブラウザでないと動作しないので
    // FileReaderにアクセス出来ない場合は、ここで処理を中止
    if (!FileReader) {
        console.error('このブラウザは、FileAPIに対応していないようです。');
        return;
    }

    // inputで指定されている画像を抜き出して、img要素で表示する
    function updatePreview () {
        // 選択されている画像がなければ中止
        if (!input.files.length) { 
            return;
        }

        // FileReaderの作成
        var reader = new FileReader();

        // このあとのreadAsDataURLが完了したタイミングで、
        // $imgに選択されている画像をセットする
        reader.onload = function (e) {
            $img.attr('src', e.target.result);
        };

        // 画像ファイルをdataURLに変換
        reader.readAsDataURL(input.files[0]);
    }

    // inputの値が選択されるたびに、updatePreviewを呼ぶ
    $input.on('change', updatePreview);

    // ブラウザバック等でページに来た際は、最初からファイルが
    // 選択されていることもあるので、一度updatePreviewを実行しておく
    updatePreview();


    // ===================================================================
    // ドラッグ&ドロップでもファイルを指定できるようにする
    // ===================================================================

    $img
        .on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $img.attr('class', 'form__preview--drag');
        })
        .on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragleave', function () {
            $img.attr('class', 'form__preview');
        })
        .on('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var dataTransfer = e.originalEvent.dataTransfer;
            if (!dataTransfer || !dataTransfer.files.length) {
                return;
            }

            input.files = dataTransfer.files;

            $img.attr('class', 'form__preview');
        });
}

function LabeledRangeInput (opts) {
    this.$el = opts.$el;
    this.labels = opts.labels;

    this.initLabel();
    this.updateLabel();

    this.initListeners();
}

LabeledRangeInput.prototype.initLabel = function () {
    var $el = this.$el;
    var $label = $('<label class="form__input__label"/>');
    $el.after($label);
    this.$label = $label;
};

LabeledRangeInput.prototype.updateLabel = function () {
    var $el = this.$el;
    var label = this.labels[$el.val()] || '';
    this.$label.text(label);
};

LabeledRangeInput.prototype.initListeners = function () {
    var self = this;
    var $el = this.$el;

    $el.on('change', function () {
        self.updateLabel();
    });
};

function FormSection (opts) {
    this.$el = opts.$el || $('<div />');
    this.prev = opts.prev || null;

    this.passed = false;
    this.$input = this.$el.find('.form__input input');
    this.$header = this.$el.find('.form__header');

    if (this.prev) {
        this.prev.next = this;
    }

    this.initCheck();
    this.updateCheck();

    this.initListeners();
    this.hide();
}

// イベントリスナー周りの初期化
FormSection.prototype.initListeners = function () {
    var self = this;
    var $input = this.$input;

    $input.on('change', function () {
        self.updateCheck();

        if (!self.passed && self.filled()) {
            self.passed = true;
            self.showNext();
        }
    });
};

// 入力済かどうかを表示する要素
FormSection.prototype.initCheck = function () {
    var $check = $('<div />');
    if (this.$header) {
        this.$header.append($check);
    }
    this.$check = $check;
};

// 入力済かどうかを表示する要素を更新
FormSection.prototype.updateCheck = function () {
    var $check = this.$check;
    var isFilled = this.filled();

    $check.attr('class', isFilled ? 'form__check--filled' : 'form__check');
};

// 自分の持っているinput要素が、入力済みかどうかを確認
FormSection.prototype.filled = function () {
    var $input = this.$input;
    var value = $input.val();
    var type = $input.attr('type');

    // numberのinputに限り、値は数値として評価
    // (=> 0の場合はfalseとなる)
    if (type == 'number') {
        value = Number(value);
    }

    // 否定を2回かけることで、真偽値にして返す
    return !!value; 
};

// 自分の次のセクションを表示
FormSection.prototype.showNext = function () {
    // つぎのセクションがセットされていない場合は何もしない
    if (!this.next) {
        return;
    }

    var next = this.next;
    next.show(function () {
        if (next.filled()) {
            next.showNext();
        }
    });
};

// このセクションを表示
FormSection.prototype.show = function (callback) {
    var $el = this.$el;

    // callbackがある場合は、アニメーション付きで表示
    if (callback) {
        $el.slideDown(callback);
    } else {
        $el.show();
    }
};

// このセクションを非表示に
FormSection.prototype.hide = function (callback) {
    var $el = this.$el;

    // callbackがある場合は、アニメーション付きでかくす
    if (callback) {
        $el.slideUp(callback);
    } else {
        $el.hide();
    }
};

function FormManager ($el, selector) {
    this.$el = $el;

    this.initSections($el.find(selector));
    this.initListeners();
}

// FormSectionの初期化
FormManager.prototype.initSections = function ($sections) {
    var sections = [];
    $sections.each(function (index) {
        sections.push(new FormSection({
            $el: $(this),
            prev: sections[index - 1] || null
        }));
    });

    // 最初のセクションはデフォルトで表示
    var firstSection = sections[0];
    firstSection.show();

    // フォーム送信後、ブラウザの「戻る」で再表示された場合など、
    // 既に最初のセクションが入力済みなら、さらに次のセクションも表示
    if (firstSection.filled()) {
        firstSection.showNext();
    }

    this.sections = sections;
};

FormManager.prototype.initListeners = function () {
    var self = this;
    var $el = this.$el;

    // すべての入力が完了していない時に送信が行われた場合は、送信をキャンセル
    $el.on('submit', function (e) {
        if (!self.filled()) {
            alert('入力が完了していない項目があります。');
            e.preventDefault();
        }
    });
};

// 自分の中にあるFormSectionが、すべて入力済みならtrueを返す
FormManager.prototype.filled = function () {
    var sections = this.sections;

    var isValid = true;
    $.each(sections, function (index, section) {
        isValid = section.filled() && isValid;
    });

    return isValid; 
};

$(function () {
    // フォーム全体の流れを管理するmanager
    new FormManager($('#form'), '.form__section');


    // ラベル付きrangeフォーム
    new LabeledRangeInput({
        $el: $('.form__section input[name="size"]'),
        labels: ['SS', 'S', 'M', 'L', 'XL']
    });


    // プレビュー付き・ドラッグ&ドロップ可能なアップロードフォーム
    var $imageInput = $('.form__section input[name="image"]');
    new FileInput({
        input: $imageInput.get(0)
    });


    // 要素の順番を指定するフォーム
    new OrderInput({
        $list: $('.form__input__order')
    });
});
