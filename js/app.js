(() => {
    "use strict";
    function formSubmit() {
        document.addEventListener("DOMContentLoaded", (function() {
            const form = document.getElementById("form");
            form.addEventListener("submit", formSend);
            async function formSend(e) {
                e.preventDefault();
                let error = formValidate(form);
                let formData = new FormData(form);
                if (0 === error) {
                    document.body.classList.add("_sending");
                    let response = await fetch("files/sendmail/sendmail.php", {
                        method: "POST",
                        body: formData
                    });
                    if (response.ok) {
                        document.body.classList.remove("_sending");
                        let result = await response.json();
                        alert(result.message);
                        formPreview.innerHTML = "";
                        form.reset();
                    } else {
                        document.body.classList.remove("_sending");
                        alert("Ошибка");
                    }
                } else alert("Заполните обязательные поля");
            }
            function formValidate(form) {
                let error = 0;
                let formReq = document.querySelectorAll("._req");
                for (let index = 0; index < formReq.length; index++) {
                    const input = formReq[index];
                    formRemoveError(input);
                    if (input.classList.contains("_email")) {
                        if (emailTest(input)) {
                            formAddError(input);
                            error++;
                        }
                    } else if ("checkbox" === input.getAttribute("type") && false === input.checked) {
                        formAddError(input);
                        error++;
                    } else if ("" === input.value) {
                        formAddError(input);
                        error++;
                    }
                }
                return error;
            }
            function formAddError(input) {
                input.parentElement.classList.add("_error");
                input.classList.add("_error");
            }
            function formRemoveError(input) {
                input.parentElement.classList.remove("_error");
                input.classList.remove("_error");
            }
            function emailTest(input) {
                return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
            }
            const formPreview = document.getElementById("formPreview");
        }));
    }
    let selects = document.getElementsByTagName("select");
    if (selects.length > 0) selects_init();
    function selects_init() {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_init(select);
        }
        document.addEventListener("click", (function(e) {
            selects_close(e);
        }));
        document.addEventListener("keydown", (function(e) {
            if (27 == e.which) selects_close(e);
        }));
    }
    function selects_close(e) {
        const selects = document.querySelectorAll(".select");
        if (!e.target.closest(".select")) for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_body_options = select.querySelector(".select__options");
            select.classList.remove("_active");
            select_slideUp(select_body_options, 100);
        }
    }
    function select_init(select) {
        const select_parent = select.parentElement;
        const select_modifikator = select.getAttribute("class");
        const select_selected_option = select.querySelector("option:checked");
        select.setAttribute("data-default", select_selected_option.value);
        select.style.display = "none";
        select_parent.insertAdjacentHTML("beforeend", '<div class="select select_' + select_modifikator + '"></div>');
        let new_select = select.parentElement.querySelector(".select");
        new_select.appendChild(select);
        select_item(select);
    }
    function select_item(select) {
        const select_parent = select.parentElement;
        const select_items = select_parent.querySelector(".select__item");
        const select_options = select.querySelectorAll("option");
        const select_selected_option = select.querySelector("option:checked");
        const select_selected_text = select_selected_option.text;
        const select_type = select.getAttribute("data-type");
        if (select_items) select_items.remove();
        let select_type_content = "";
        if ("input" == select_type) select_type_content = '<div class="select__value"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>'; else select_type_content = '<div class="select__value"><span>' + select_selected_text + "</span></div>";
        select_parent.insertAdjacentHTML("beforeend", '<div class="select__item">' + '<div class="select__title">' + select_type_content + "</div>" + '<div class="select__options">' + select_get_options(select_options) + "</div>" + "</div></div>");
        select_actions(select, select_parent);
    }
    function select_actions(original, select) {
        const select_item = select.querySelector(".select__item");
        const select_body_options = select.querySelector(".select__options");
        const select_options = select.querySelectorAll(".select__option");
        const select_type = original.getAttribute("data-type");
        const select_input = select.querySelector(".select__input");
        select_item.addEventListener("click", (function() {
            let selects = document.querySelectorAll(".select");
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector(".select__options");
                if (select != select_item.closest(".select")) {
                    select.classList.remove("_active");
                    select_slideUp(select_body_options, 100);
                }
            }
            select_slideToggle(select_body_options, 100);
            select.classList.toggle("_active");
        }));
        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            const select_option_value = select_option.getAttribute("data-value");
            const select_option_text = select_option.innerHTML;
            if ("input" == select_type) select_input.addEventListener("keyup", select_search); else if (select_option.getAttribute("data-value") == original.value) select_option.style.display = "none";
            select_option.addEventListener("click", (function() {
                for (let index = 0; index < select_options.length; index++) {
                    const el = select_options[index];
                    el.style.display = "block";
                }
                if ("input" == select_type) {
                    select_input.value = select_option_text;
                    original.value = select_option_value;
                } else {
                    select.querySelector(".select__value").innerHTML = "<span>" + select_option_text + "</span>";
                    original.value = select_option_value;
                    select_option.style.display = "none";
                }
            }));
        }
    }
    function select_get_options(select_options) {
        if (select_options) {
            let select_options_content = "";
            for (let index = 0; index < select_options.length; index++) {
                const select_option = select_options[index];
                const select_option_value = select_option.value;
                if ("" != select_option_value) {
                    const select_option_text = select_option.text;
                    select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + "</div>";
                }
            }
            return select_options_content;
        }
    }
    function select_search(e) {
        e.target.closest(".select ").querySelector(".select__options");
        let select_options = e.target.closest(".select ").querySelectorAll(".select__option");
        let select_search_text = e.target.value.toUpperCase();
        for (let i = 0; i < select_options.length; i++) {
            let select_option = select_options[i];
            let select_txt_value = select_option.textContent || select_option.innerText;
            if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) select_option.style.display = ""; else select_option.style.display = "none";
        }
    }
    let select_slideUp = (target, duration = 500) => {
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = target.offsetHeight + "px";
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout((() => {
            target.style.display = "none";
            target.style.removeProperty("height");
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }), duration);
    };
    let select_slideDown = (target, duration = 500) => {
        target.style.removeProperty("display");
        let display = window.getComputedStyle(target).display;
        if ("none" === display) display = "block";
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout((() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }), duration);
    };
    let select_slideToggle = (target, duration = 500) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            if ("none" === window.getComputedStyle(target).display) return select_slideDown(target, duration); else return select_slideUp(target, duration);
        }
    };
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    let formWrapper = document.querySelectorAll(".form__wrapper");
    if (formWrapper.length > 0) {
        let formBlocks = document.querySelectorAll(".form__block");
        let formButtons = document.querySelectorAll(".form__buttons");
        let num = 0;
        formButtons.forEach((formButton => {
            formButton.addEventListener("click", (function(e) {
                if (e.target.classList.contains("form__next")) {
                    formBlocks[num].classList.remove("_active");
                    num++;
                    formBlocks[num].classList.add("_active");
                }
                if (e.target.classList.contains("form__prev")) {
                    formBlocks[num].classList.remove("_active");
                    num--;
                    formBlocks[num].classList.add("_active");
                }
                e.preventDefault();
            }));
        }));
    }
    window["FLS"] = true;
    isWebp();
    formSubmit();
})();