const container = document.getElementById("container");
const pseudocode = document.getElementById("pseudocode");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const robot = document.getElementById("robot");
const robotMessage = document.getElementById("robotMessage");

const popSound = new Audio("pop.mp3");
const swapSound = new Audio("swap.mp3");
const splashSound = new Audio("splash.mp3");

popSound.volume = 0.25;
swapSound.volume = 0.35;
splashSound.volume = 0.50;

let values = [];
let speed = 200;
let paused = false;
let running = false;

/* =========================
   ROBOT STATES
========================= */

function setRobotState(state) {

    robot.classList.remove(
        "robot-idle",
        "robot-sorting",
        "robot-success"
    );

    robot.classList.add(state);
}

/* =========================
   AUDIO
========================= */

function unlockAudio() {

    [popSound, swapSound, splashSound]
        .forEach(sound => {

            const p = sound.play();

            if (p) {

                p.then(() => {

                    sound.pause();
                    sound.currentTime = 0;

                }).catch(() => {});

            }
        });
}

function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(() => {});
}

/* =========================
   ARRAY GENERATION
========================= */

function generateArray() {

    if (running) return;

    values = Array.from(
        { length: 25 },
        () => Math.floor(Math.random() * 90) + 10
    );

    draw();
}

/* =========================
   DRAW BARS
========================= */

function draw(active = [], sorted = false) {

    container.innerHTML = "";

    values.forEach((value, index) => {

        const bar =
            document.createElement("div");

        bar.className = "bar";

        bar.style.height =
            `${value * 3}px`;

        bar.style.width = "3%";

        if (sorted) {

            bar.style.background =
                "#22c55e";

        }

        else if (
            active.includes(index)
        ) {

            bar.style.background =
                "#38bdf8";

        }

        else {

            bar.style.background =
                "#818cf8";
        }

        container.appendChild(bar);
    });
}

/* =========================
   WAIT
========================= */

async function wait() {

    while (paused) {

        await new Promise(resolve =>
            setTimeout(resolve, 100)
        );
    }

    await new Promise(resolve =>
        setTimeout(resolve, speed)
    );
}

/* =========================
   SHOW STEP
========================= */

async function show(
    message,
    indexes = []
) {

    playSound(popSound);

    pseudocode.textContent =
        message;

    draw(indexes);

    await wait();
}

/* =========================
   SPEED CONTROL
========================= */

function updateSpeed(value) {

    speed = Number(value);

    speedValue.textContent =
        `${value}ms`;
}

speedSlider.addEventListener(
    "input",
    () => {
        updateSpeed(
            speedSlider.value
        );
    }
);

/* =========================
   PAUSE / RESUME
========================= */

function pauseSort() {
    paused = true;
}

function resumeSort() {
    paused = false;
}

/* =========================
   BUBBLE SORT
========================= */

async function bubbleSort() {

    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        for (
            let j = 0;
            j < values.length - i - 1;
            j++
        ) {

            await show(
                "Bubble Sort: Comparing Elements",
                [j, j + 1]
            );

            if (
                values[j] >
                values[j + 1]
            ) {

                playSound(
                    swapSound
                );

                [
                    values[j],
                    values[j + 1]
                ] =
                [
                    values[j + 1],
                    values[j]
                ];

                draw([
                    j,
                    j + 1
                ]);

                await wait();
            }
        }
    }
}

/* =========================
   SELECTION SORT
========================= */

async function selectionSort() {

    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        let min = i;

        for (
            let j = i + 1;
            j < values.length;
            j++
        ) {

            await show(
                "Selection Sort: Finding Minimum",
                [min, j]
            );

            if (
                values[j] <
                values[min]
            ) {

                min = j;
            }
        }

        if (min !== i) {

            playSound(
                swapSound
            );

            [
                values[i],
                values[min]
            ] =
            [
                values[min],
                values[i]
            ];

            draw([i, min]);

            await wait();
        }
    }
}

/* =========================
   INSERTION SORT
========================= */

async function insertionSort() {

    for (
        let i = 1;
        i < values.length;
        i++
    ) {

        let key = values[i];
        let j = i - 1;

        while (
            j >= 0 &&
            values[j] > key
        ) {

            playSound(
                swapSound
            );

            values[j + 1] =
                values[j];

            draw([
                j,
                j + 1
            ]);

            await wait();

            j--;
        }

        values[j + 1] = key;

        draw([j + 1]);

        await wait();
    }
}

/* =========================
   MERGE SORT
========================= */

async function mergeSort(
    start,
    end
) {

    if (start >= end)
        return;

    const mid =
        Math.floor(
            (start + end) / 2
        );

    await mergeSort(
        start,
        mid
    );

    await mergeSort(
        mid + 1,
        end
    );

    let left =
        values.slice(
            start,
            mid + 1
        );

    let right =
        values.slice(
            mid + 1,
            end + 1
        );

    let i = 0;
    let j = 0;
    let k = start;

    while (
        i < left.length &&
        j < right.length
    ) {

        await show(
            "Merge Sort: Merging",
            [k]
        );

        if (
            left[i] <= right[j]
        ) {

            values[k++] =
                left[i++];

        } else {

            values[k++] =
                right[j++];
        }
    }

    while (
        i < left.length
    ) {

        values[k++] =
            left[i++];
    }

    while (
        j < right.length
    ) {

        values[k++] =
            right[j++];
    }

    draw();
}

/* =========================
   QUICK SORT
========================= */

async function quickSort(
    low,
    high
) {

    if (low >= high)
        return;

    let pivot =
        values[high];

    let i = low;

    for (
        let j = low;
        j < high;
        j++
    ) {

        await show(
            "Quick Sort: Comparing With Pivot",
            [j, high]
        );

        if (
            values[j] < pivot
        ) {

            playSound(
                swapSound
            );

            [
                values[i],
                values[j]
            ] =
            [
                values[j],
                values[i]
            ];

            draw([i, j]);

            await wait();

            i++;
        }
    }

    playSound(
        swapSound
    );

    [
        values[i],
        values[high]
    ] =
    [
        values[high],
        values[i]
    ];

    draw([i, high]);

    await wait();

    await quickSort(
        low,
        i - 1
    );

    await quickSort(
        i + 1,
        high
    );
}

/* =========================
   COUNTING SORT
========================= */

async function countingSort() {

    let max =
        Math.max(
            ...values
        );

    let count =
        Array(
            max + 1
        ).fill(0);

    values.forEach(
        v => count[v]++
    );

    let index = 0;

    for (
        let i = 0;
        i <= max;
        i++
    ) {

        while (
            count[i] > 0
        ) {

            await show(
                "Counting Sort: Placing Elements",
                [index]
            );

            values[index++] =
                i;

            count[i]--;
        }
    }
}

/* =========================
   RADIX SORT
========================= */

async function radixSort() {

    let max =
        Math.max(
            ...values
        );

    for (
        let exp = 1;
        Math.floor(
            max / exp
        ) > 0;
        exp *= 10
    ) {

        let buckets =
            Array.from(
                { length: 10 },
                () => []
            );

        for (
            let num
            of values
        ) {

            let digit =
                Math.floor(
                    num / exp
                ) % 10;

            buckets[digit]
                .push(num);
        }

        values =
            buckets.flat();

        await show(
            "Radix Sort: Sorting By Digit"
        );
    }
}

/* =========================
   START SORT
========================= */

async function startSort(type) {

    if (running)
        return;

    generateArray();

    running = true;
    paused = false;

    setRobotState(
        "robot-sorting"
    );

    robotMessage.textContent =
        "Working Hard...";

    try {

        if (
            type === "bubble"
        ) {
            await bubbleSort();
        }

        else if (
            type === "selection"
        ) {
            await selectionSort();
        }

        else if (
            type === "insertion"
        ) {
            await insertionSort();
        }

        else if (
            type === "merge"
        ) {
            await mergeSort(
                0,
                values.length - 1
            );
        }

        else if (
            type === "quick"
        ) {
            await quickSort(
                0,
                values.length - 1
            );
        }

        else if (
            type === "counting"
        ) {
            await countingSort();
        }

        else if (
            type === "radix"
        ) {
            await radixSort();
        }

        playSound(
            splashSound
        );

        setRobotState(
            "robot-success"
        );

        robotMessage.textContent =
            "Array Sorted!";

        pseudocode.textContent =
            "Sorting Completed Successfully!";

        draw([], true);

        setTimeout(() => {

            setRobotState(
                "robot-idle"
            );

            robotMessage.textContent =
                "Ready to Sort!";

        }, 3000);

    }

    finally {

        running = false;
        paused = false;
    }
}

/* =========================
   INITIALIZATION
========================= */

setRobotState(
    "robot-idle"
);

robotMessage.textContent =
    "Ready to Sort!";

generateArray();

updateSpeed(
    speedSlider.value
);