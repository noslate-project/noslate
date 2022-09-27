'use strict';

function returnPage() {
let html = `
<html>
<head>
<title>LEB128</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="https://cdn.bootcdn.net/ajax/libs/tailwindcss/1.4.1/tailwind.min.css" rel="stylesheet">

<script>
function sleb128_decode(array) {
    let num = 0n;
    let shift = 0;
    let a;
    for (i in array) {
        a = array[i];
        num |= BigInt(a & 0x7f) << BigInt(shift);
        shift += 7;
        if (a >> 7 === 0) {
            break;
        }
    }
    return BigInt.asIntN(shift, num)
}

function sleb128_encode(number) {
    const isNeg = number < 0;
    let num = BigInt.asUintN(128, number);

    let out = []
    while (true) {
        const i = Number( num & 0x7fn )
        num >>= 7n; 
        if ((isNegOne(num) && (i & 0x40) !== 0) ||
            (num === 0n && (i & 0x40) === 0)) {
            out.push(i)
            break
          } else {
            out.push(i | 0x80);
        }
    }

    function isNegOne (num) {
        return isNeg && num.toString(2).indexOf('0') < 0
    }
    return out;
}

function uleb128_decode (array) {
    let num = BigInt.asUintN(128, 0n);
    let shift = 0;
    let a;
    for (i in array) {
        a = array[i];
        num |= BigInt(a & 0x7f) << BigInt(shift);
        shift += 7
        if (a >> 7 === 0) {
            break
        }
    }
    return num;
}

function uleb128_encode (number) {
    let num = BigInt.asUintN(128, number);
    let out = [];
    while (true) {
        const i = Number(num & 0x7fn);
        num >>= 7n;
        if (num === 0n) {
            out.push(i);
            break
        } else {
            out.push(i | 0x80);
        }
    }
    return out;
}

function array2string(array) {
    var out = [];
    for (i in array) {
        var a = array[i];
        out.push(toPaddedHexString(a, 2));
    }
    return out.join(' ');
    function toPaddedHexString(num, len) {
        str = num.toString(16);
        return "0".repeat(len - str.length) + str;
    }
}

function string2array(string) {
    var array = string.split(' ');
    var out = [];
    for (i in array) {
        var a = parseInt(array[i], 16);
        out.push(a);
    }
    console.log(out)
    return out;
}

function encode() {
    var sign = document.leb128.sign.value;
    console.log(sign)
    var enc = document.leb128.text_enc.value;
    var r;
    if (sign == 1) {
        r = sleb128_encode(enc);
    } else {
        r = uleb128_encode(enc);
    }
    document.leb128.text_dec.value = array2string(r);
}
function decode() {
    var sign = document.leb128.sign.value;
    var dec = document.leb128.text_dec.value;
    dec = string2array(dec);
    var r;
    if (sign == 1) {
        r = sleb128_decode(dec);
    } else {
        r = uleb128_decode(dec);
    }
    document.leb128.text_enc.value = r;
}
</script>
</head>
<body class="bg-gray-100">

    <main class="mx-auto mt-6 mb-16 sm:mt-8 px-4 sm:px-8 md:px-12 max-w-screen-md">
    <div class="bg-white p-6 sm:p-8 border border-gray-200 mt-4">
        <h2 class="text-gray-900 text-xl font-bold mt-4 h-8">
            LEB128 编解码
        </h2>
        <p class="mt-4 text-gray-700">
            LEB128 or Little Endian Base 128 is a variable-length code compression used to store arbitrarily large integers in a small number of bytes. 
            LEB128 is used in the DWARF debug file format and the WebAssembly binary encoding for all integer literals.
        </p>
        <p class="mt-4 text-gray-700">
            There are 2 versions of LEB128: unsigned LEB128 and signed LEB128. 
            The decoder must know whether the encoded value is unsigned LEB128 or signed LEB128.
        </p>
        <div class="flex flex-col py-4">
            <form name="leb128" onsubmit="return false;">
            <div class="grid grid-cols-1 sm:grid-cols-7 mt-4 gap-4">
                <div class="relative text-gray-800 border border-solid sm:col-span-6">
                    <input type="text" name="text_enc" class="w-full px-3 py-2 outline-none" /> 
                </div>
                <div class="">
                    <button class="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-500 hover:bg-blue-700"
                        name="btn_enc" onclick="encode()">
                        Encode
                    </button>
                </div>
            </div>

            <div class="mt-4">
                <div class="pt-2">
                    <label>
                        <input type="radio" name="sign" value=1 checked="checked"> Signed </input>
                    </label>
                    <label>
                        <input type="radio" name="sign" value=0 > Unsigned </input>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-7 mt-4 gap-4">
                <div class="relative text-gray-800 border border-solid sm:col-span-6">
                    <input type="text" name="text_dec" class="w-full py-2 px-3 outline-none" /> 
                </div>
                <div class="">
                    <button class="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-500 hover:bg-blue-700"
                        name="btn_dec" onclick="decode()">
                        Decode 
                    </button>
                </div>
            </div>
            </form>
        </div>
    </div>
    </main>
    <p class="text-center text-gray-400">
        基于 alinode-cloud (serverless worker) 开发
    </p>
</body>
</html>`
    return html;
}

async function doApp (code) {
  return new Response(code, { "status": 200, "headers": {"Content-Type": "text/html"}})
}

async function app(req) {
    let reqUrl = new URL(req.url).pathname;
    
    if (reqUrl.startsWith(`/`)) {
        if (req.method == 'GET') {
            return new Response(returnPage(), {
                "headers": {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        } else if (req.method == 'POST') {
            const formData = await req.formData();
            return new Response(returnPage(formData.get('url')), {
                "headers": {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
    } else {
        return new Response([reqUrl, req.url].join('<br/>'), {
            status: 404,
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

async function tryApp(req) {
    let rsp;
    try {
        rsp = await app(req);
    } catch (e) {
        rsp = new Response(e.stack, {
            status: 500,
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
    return rsp;
}

addEventListener('fetch', event => {
  event.respondWith(tryApp(event.request));
});
