(function($) { // Thanks to BrunoLM (https://stackoverflow.com/a/3855394)
    $.QueryString = (function(paramsArray) {
        let params = {};

        for (let i = 0; i < paramsArray.length; ++i) {
            let param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

function escapeRegExp(string) { // Thanks to coolaj86 and Darren Cook (https://stackoverflow.com/a/6969486)
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(message) {
    return message
        .replace(/&/g, "&amp;")
        .replace(/(<)(?!3)/g, "&lt;")
        .replace(/(>)(?!\()/g, "&gt;");
}

function TwitchAPI(url) {
    //return $.getJSON(url + (url.search(/\?/) > -1 ? '&' : '?') + 'client_id=pecd503dsvkxpdaz1eopqwcf4ke8pg');
    return $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", 'Bearer zw0pbcisz2tu9j21ej05fingxocjtv');
            request.setRequestHeader("Client-id", 'pecd503dsvkxpdaz1eopqwcf4ke8pg');
        },
        dataType: "json",
        //url: url + (url.search(/\?/) > -1 ? '&' : '?') + 'client_id=pecd503dsvkxpdaz1eopqwcf4ke8pg',
        url:url

    })
}

Chat = {
    info: {
        channelId: '237819753',
        channel: 'nessalpaca',
        animate: true,
        bots: false,
        fade: true,
        size: 2,
        font: 0,
        stroke: false,
        shadow: false,
        smallCaps: false,
        // animate: ('animate' in $.QueryString ? ($.QueryString.animate.toLowerCase() === 'true') : false),
        // bots: ('bots' in $.QueryString ? ($.QueryString.bots.toLowerCase() === 'true') : false),
        // fade: ('fade' in $.QueryString ? parseInt($.QueryString.fade) : false),
        // size: ('size' in $.QueryString ? parseInt($.QueryString.size) : 3),
        // font: ('font' in $.QueryString ? parseInt($.QueryString.font) : 0),
        // stroke: ('stroke' in $.QueryString ? parseInt($.QueryString.stroke) : false),
        // shadow: ('shadow' in $.QueryString ? parseInt($.QueryString.shadow) : false),
        // smallCaps: ('small_caps' in $.QueryString ? ($.QueryString.small_caps.toLowerCase() === 'true') : false),
        emotes: {},
        badges: {},
        cheers: {},
        lines: []
    },

    loadEmotes: function(channelID) {
        Chat.info.emotes = {};
        // Load BTTV, FFZ and 7TV emotes
        ['emotes/global', 'users/twitch/237819753'].forEach(endpoint => {
            $.getJSON('https://api.betterttv.net/3/cached/frankerfacez/' + endpoint).done(function(res) {
                res.forEach(emote => {
                    if (emote.images['4x']) {
                        var imageUrl = emote.images['4x'];
                        var upscale = false;
                    } else {
                        var imageUrl = emote.images['2x'] || emote.images['1x'];
                        var upscale = true;
                    }
                    Chat.info.emotes[emote.code] = {
                        id: emote.id,
                        image: imageUrl,
                        upscale: upscale
                    };
                });
            });
        });

        ['emotes/global', 'users/twitch/237819753'].forEach(endpoint => {
            $.getJSON('https://api.betterttv.net/3/cached/' + endpoint).done(function(res) {
                if (!Array.isArray(res)) {
                    res = res.channelEmotes.concat(res.sharedEmotes);
                }
                res.forEach(emote => {
                    Chat.info.emotes[emote.code] = {
                        id: emote.id,
                        image: 'https://cdn.betterttv.net/emote/' + emote.id + '/3x'
                    };
                });
            });
        });

        ['emotes/global', 'users/237819753/emotes'].forEach(endpoint => {
            $.getJSON('https://api.7tv.app/v2/' + endpoint).done(function(res) {
                res.forEach(emote => {
                    Chat.info.emotes[emote.name] = {
                        id: emote.id,
                        image: emote.urls[emote.urls.length - 1][1]
                    };
                });
            });
        });
    },

    load: function(callback) {
        TwitchAPI('https://api.twitch.tv/helix/users?login=' + Chat.info.channel).done(function(res) {
            console.log('result: ',res);
            Chat.info.channelID = res.data[0]._id;
            Chat.loadEmotes(Chat.info.channelID);

            // Load CSS
            switch (Chat.info.size) {
                case 1:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/size_small.css"
                    }).appendTo("head");
                    break;
                case 2:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/size_medium.css"
                    }).appendTo("head");
                    break;
                default:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/size_large.css"
                    }).appendTo("head");
                    break;
            }

            switch (Chat.info.font) {
                case 1:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_SegoeUI.css"
                    }).appendTo("head");
                    break;
                case 2:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_Roboto.css"
                    }).appendTo("head");
                    break;
                case 3:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_Lato.css"
                    }).appendTo("head");
                    break;
                case 4:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_NotoSans.css"
                    }).appendTo("head");
                    break;
                case 5:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_SourceCodePro.css"
                    }).appendTo("head");
                    break;
                case 6:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_Impact.css"
                    }).appendTo("head");
                    break;
                case 7:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_Comfortaa.css"
                    }).appendTo("head");
                    break;
                case 8:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_DancingScript.css"
                    }).appendTo("head");
                    break;
                case 9:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_IndieFlower.css"
                    }).appendTo("head");
                    break;
                default:
                    $("<link/>", {
                        rel: "stylesheet",
                        type: "text/css",
                        href: "styles/font_BalooTammudu.css"
                    }).appendTo("head");
                    break;
            }

            if (Chat.info.stroke) {
                switch (Chat.info.stroke) {
                    case 1:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/stroke_thin.css"
                        }).appendTo("head");
                        break;
                    case 2:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/stroke_medium.css"
                        }).appendTo("head");
                        break;
                    case 3:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/stroke_thick.css"
                        }).appendTo("head");
                        break;
                    case 4:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/stroke_thicker.css"
                        }).appendTo("head");
                        break;
                }
            }

            if (Chat.info.shadow) {
                switch (Chat.info.shadow) {
                    case 1:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/shadow_small.css"
                        }).appendTo("head");
                        break;
                    case 2:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/shadow_medium.css"
                        }).appendTo("head");
                        break;
                    case 3:
                        $("<link/>", {
                            rel: "stylesheet",
                            type: "text/css",
                            href: "styles/shadow_large.css"
                        }).appendTo("head");
                        break;
                }
            }

            if (Chat.info.smallCaps) {
                $("<link/>", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: "styles/variant_SmallCaps.css"
                }).appendTo("head");
            }

            // Load badges
            TwitchAPI('https://badges.twitch.tv/v1/badges/global/display').done(function(global) {
                Object.entries(global.badge_sets).forEach(badge => {
                    Object.entries(badge[1].versions).forEach(v => {
                        Chat.info.badges[badge[0] + ':' + v[0]] = v[1].image_url_4x;
                    });
                });
                TwitchAPI('https://badges.twitch.tv/v1/badges/channels/237819753/display').done(function(channel) {
                    Object.entries(channel.badge_sets).forEach(badge => {
                        Object.entries(badge[1].versions).forEach(v => {
                            Chat.info.badges[badge[0] + ':' + v[0]] = v[1].image_url_4x;
                        });
                    });
                });
            });

            // Load cheers images
            TwitchAPI("https://api.twitch.tv/helix/bits/actions?channel_id=" + Chat.info.channelId).done(function(res) {
                res.actions.forEach(action => {
                    Chat.info.cheers[action.prefix] = {}
                    action.tiers.forEach(tier => {
                        Chat.info.cheers[action.prefix][tier.min_bits] = {
                            image: tier.images.light.animated['4'],
                            color: tier.color
                        };
                    });
                });
            });

            callback(true);
        });
    },

    update: setInterval(function() {
        if (Chat.info.lines.length > 0) {
            var lines = Chat.info.lines.join('');

            if (Chat.info.animate) {
                var $auxDiv = $('<div></div>', { class: "hidden" }).appendTo("#chat_container");
                $auxDiv.append(lines);
                var auxHeight = $auxDiv.height();
                $auxDiv.remove();

                var $animDiv = $('<div></div>');
                $('#chat_container').append($animDiv);
                $animDiv.animate({ "height": auxHeight }, 150, function() {
                    $(this).remove();
                    $('#chat_container').append(lines);
                });
            } else {
                $('#chat_container').append(lines);
            }
            Chat.info.lines = [];
            var linesToDelete = $('.chat_line').length - 100;
            while (linesToDelete > 0) {
                $('.chat_line').eq(0).remove();
                linesToDelete--;
            }
        } else if (Chat.info.fade) {
            var messageTime = $('.chat_line').eq(0).data('time');
            if ((Date.now() - messageTime) / 6000 >= Chat.info.fade) {
                $('.chat_line').eq(0).fadeOut(function() {
                    $(this).remove();
                });
            }
        }
    }, 200),

    write: function(nick, info, message) {
        if (info) {
            var $chatLine = $('<div></div>');
            //random number here
            //var num = Math.floor(Math.random() * (9 - 1)) + 1;
            $chatLine.css("top", Math.floor(Math.random() * (1050 - 800) ) + 800);
            $chatLine.addClass(`chat_line`);
            $chatLine.attr('data-nick', nick);
            $chatLine.attr('data-time', Date.now());
            $chatLine.attr('data-id', info.id);
            var $userInfo = $('<span></span>');
            $userInfo.addClass('user_info');

            // Writing badges
            // if (typeof(info.badges) === 'string') {
            //     info.badges.split(',').forEach(badge => {
            //         var $badge = $('<img/>');
            //         $badge.addClass('badge');
            //         badge = badge.split('/');
            //         $badge.attr('src', Chat.info.badges[badge[0] + ':' + badge[1]]);
            //         $userInfo.append($badge);
            //     });
            // }

            // Writing username
            var $username = $('<span></span>');
            $username.addClass('nick');
            if (typeof(info.color) === 'string') {
                if (tinycolor(info.color).getBrightness() <= 50) var color = tinycolor(info.color).lighten(30);
                else var color = info.color;
            } else {
                const twitchColors = ["#FF0000", "#0000FF", "#008000", "#B22222", "#FF7F50", "#9ACD32", "#FF4500", "#2E8B57", "#DAA520", "#D2691E", "#5F9EA0", "#1E90FF", "#FF69B4", "#8A2BE2", "#00FF7F"];
                var color = twitchColors[nick.charCodeAt(0) % 15];
            }
            $username.css('color', color);
            $username.html(info['display-name'] ? info['display-name'] : nick);
            $userInfo.append($username);

            // Writing message
            var $message = $('<span></span>');
            $message.addClass('message');
            if (/^\x01ACTION.*\x01$/.test(message)) {
                $message.css('color', color);
                message = message.replace(/^\x01ACTION/, '').replace(/\x01$/, '').trim();
                $userInfo.append('<span>&nbsp;</span>');
            } else {
                $userInfo.append('<span class="colon">:</span>');
            }
            console.log ('nick', nick);
            if (message.length < 100) {
                var ranNum = Math.floor(Math.random() * 10);
                if (ranNum <= 1) {
                    responsiveVoice.speak(message, "Japanese Female");
                }
            }
            $chatLine.append($userInfo);

            // Replacing emotes and cheers
            var replacements = {};
            if (typeof(info.emotes) === 'string') {
                info.emotes.split('/').forEach(emoteData => {
                    var twitchEmote = emoteData.split(':');
                    var indexes = twitchEmote[1].split(',')[0].split('-');
                    var emojis = new RegExp('[\u1000-\uFFFF]+', 'g');
                    var aux = message.replace(emojis, ' ');
                    var emoteCode = aux.substr(indexes[0], indexes[1] - indexes[0] + 1);
                    replacements[emoteCode] = '<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/' + twitchEmote[0] + '/default/dark/3.0" />';
                });
            }

            Object.entries(Chat.info.emotes).forEach(emote => {
                if (message.search(emote[0]) > -1) {
                    if (emote[1].upscale) replacements[emote[0]] = '<img class="emote upscale" src="' + emote[1].image + '" />';
                    else replacements[emote[0]] = '<img class="emote" src="' + emote[1].image + '" />';
                }
            });

            message = escapeHtml(message);

            if (info.bits && parseInt(info.bits) > 0) {
                var bits = parseInt(info.bits);
                var parsed = false;
                for (cheerType of Object.entries(Chat.info.cheers)) {
                    var regex = new RegExp(cheerType[0] + "\\d+\\s*", 'ig');
                    if (message.search(regex) > -1) {
                        message = message.replace(regex, '');

                        if (!parsed) {
                            var closest = 1;
                            for (cheerTier of Object.keys(cheerType[1]).map(Number).sort((a, b) => a - b)) {
                                if (bits >= cheerTier) closest = cheerTier;
                                else break;
                            }
                            message = '<img class="cheer_emote" src="' + cheerType[1][closest].image + '" /><span class="cheer_bits" style="color: ' + cheerType[1][closest].color + ';">' + bits + '</span> ' + message;
                            parsed = true;
                        }
                    }
                }
            }

            var replacementKeys = Object.keys(replacements);
            replacementKeys.sort(function(a, b) {
                return b.length - a.length;
            });

            replacementKeys.forEach(replacementKey => {
                var regex = new RegExp("(?<!\\S)(" + escapeRegExp(replacementKey) + ")(?!\\S)", 'g');
                message = message.replace(regex, replacements[replacementKey]);
            });

            message = twemoji.parse(message);
            $message.html(message);
            $chatLine.append($message);
            console.log($chatLine.wrap('<div>').parent().html());
            Chat.info.lines.push($chatLine.wrap('<div>').parent().html());
        }
    },

    clearChat: function(nick) {
        $('.chat_line[data-nick=' + nick + ']').remove();
    },

    clearMessage: function(id) {
        $('.chat_line[data-id=' + id + ']').remove();
    },

    connect: function(channel) {
        Chat.info.channel = channel;
        var title = $(document).prop('title');
        $(document).prop('title', title + Chat.info.channel);

        Chat.load(function() {
            console.log('jChat: Connecting to IRC server...');
            var socket = new ReconnectingWebSocket('wss://irc-ws.chat.twitch.tv', 'irc', { reconnectInterval: 2000 });

            socket.onopen = function() {
                console.log('jChat: Connected');
                socket.send('PASS blah\r\n');
                socket.send('NICK justinfan' + Math.floor(Math.random() * 99999) + '\r\n');
                socket.send('CAP REQ :twitch.tv/commands twitch.tv/tags\r\n');
                socket.send('JOIN #' + Chat.info.channel + '\r\n');
            };

            socket.onclose = function() {
                console.log('jChat: Disconnected');
            };

            socket.onmessage = function(data) {
                data.data.split('\r\n').forEach(line => {
                    if (!line) return;
                    var message = window.parseIRC(line);
                    if (!message.command) return;

                    switch (message.command) {
                        case "PING":
                            socket.send('PONG ' + message.params[0]);
                            return;
                        case "JOIN":
                            console.log('jChat: Joined channel #' + Chat.info.channel);
                            return;
                        case "CLEARMSG":
                            if (message.tags) Chat.clearMessage(message.tags['target-msg-id']);
                            return;
                        case "CLEARCHAT":
                            if (message.params[1]) Chat.clearChat(message.params[1]);
                            return;
                        case "PRIVMSG":
                            if (message.params[0] !== '#' + channel || !message.params[1]) return;

                            var nick = message.prefix.split('@')[0].split('!')[0];

                            if (!Chat.info.bots) {
                                const bots = ['streamelements', 'streamlabs', 'nightbot', 'moobot', 'fossabot', 'alpacabot69'];
                                if (bots.includes(nick)) return;
                            }

                            if (message.params[1].toLowerCase() === "!refreshoverlay" && typeof(message.tags.badges) === 'string') {
                                var flag = false;
                                message.tags.badges.split(',').forEach(badge => {
                                    badge = badge.split('/');
                                    if (badge[0] === "moderator" || badge[0] === "broadcaster") {
                                        flag = true;
                                        return;
                                    }
                                });
                                if (flag) {
                                    Chat.loadEmotes(Chat.info.channelID);
                                    console.log('jChat: Refreshing emotes...');
                                    return;
                                }
                            }

                            Chat.write(nick, message.tags, message.params[1]);
                            return;
                    }
                });
            };

        });
    }
};

$(document).ready(function() {
    // var marquee = $('#chat_container');
    // console.log('marquee', marquee);
    // marquee.each(function() {
    //     var mar = $(this),indent = mar.width();
    //     mar.marquee = function() {
    //         indent--;
    //         mar.css('text-indent',indent);
    //         if (indent < -1 * mar.children('.chat_line').width()) {
    //             indent = mar.width();
    //         }
    //     };
    //     mar.data('interval',setInterval(mar.marquee,1000/60));
    // });
    Chat.connect($.QueryString.channel ? $.QueryString.channel.toLowerCase() : 'nessalpaca');
});