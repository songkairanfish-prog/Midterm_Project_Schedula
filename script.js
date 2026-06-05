let currentMonth = 5
let currentYear = 2026
let selectedPill = null //for selected pill

const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")

if(menuBtn && mobileMenu){
    menuBtn.addEventListener("click", function(){
        mobileMenu.classList.toggle("hidden")
    })
}

const colorMap = {
                    default: "#9CA3AF",
                    red : "#df7a7a",
                    orange: "#F1B598",
                    green: "#C4E9DA",
                    blue: "#BEDAE3",
                    purple: "#D3C7E6",
                    pink: "#FED5CF"
                }

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"]

const selectedPillClasses = ["ring-4", "ring-emerald-300", "scale-110", "shadow-xl"] //gives selcted pill a orange ring

// This function generates a unique key for storing event counts in localStorage based on the date.
function eventKey(year, month, day) { //You can find it in Application then localStorage in Inspect Element
    return `events - ${year} - ${month + 1} - ${day}`
}

//This one creates the indicator on the pill to show users about their events
function showEventIndicator(pill, count) {
    const oldIndicator = pill.querySelector(".event-count")

    if(oldIndicator){
        oldIndicator.remove()
    }

    if(!count || count < 1){
        return
    }

    const indicator = document.createElement("span")
    indicator.className = "event-count absolute -top-1 -right-1 md:-top-2 md:-right-2 min-w-5 md:min-w-7 h-5 md:h-7 px-1 rounded-full border-2 border-black bg-orange-500 text-[10px] md:text-sm font-bold flex items-center justify-center z-10"
    indicator.textContent = count
    pill.appendChild(indicator)
}

function renderCalendar() {

    const date = new Date(currentYear, currentMonth, 1)
    const startDay = (date.getDay() + 6) % 7
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()

    const grid = document.getElementById("calendar-grid")
    grid.innerHTML = "" // clears old pills before redrawing!
    selectedPill = null

    for (let i = 0; i < startDay + totalDays; i++) {
        const today = new Date()

        today.getDate()  // gives day number (28)
        today.getMonth() // gives month (4 = May)
        today.getFullYear() // gives year (2026)

        const pill = document.createElement("div")

        if (i < startDay) {

            //Empty slot

        } else {
            
            const dayNumber = i - startDay + 1
            pill.textContent = dayNumber

            //This one let u click on the pill
            pill.addEventListener("click", function(){
                const panel = document.getElementById("day-panel")

                if(selectedPill){
                    selectedPill.classList.remove(...selectedPillClasses)
                }

                pill.classList.add(...selectedPillClasses)
                selectedPill = pill
                
                panel.classList.remove("hidden")

                panel.innerHTML = `
                    <h2 class="text-center text-xl font-semibold">${dayNumber} ${monthNames[currentMonth]} ${currentYear}</h2>

                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">

                        <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5">
                    
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-gray-400" data-color="default"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-red-400" data-color="red"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-orange-300" data-color="orange"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-emerald-200" data-color="green"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-sky-200" data-color="blue"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-purple-200" data-color="purple"></div>
                            <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-black rounded-full bg-rose-100" data-color="pink"></div>
                            
                        </div>

                        <div id="event-section" class="flex flex-col items-center md:items-end mr-0 md:mr-4">
                            <button id="event-btn" class="w-9 h-9 md:w-10 md:h-10 border-2 border-black rounded-full bg-orange-500 text-lg md:text-xl font-bold">!</button>
                        </div>

                        </div>

                        <div class="mt-6 mx-0 md:mx-20 rounded-3xl border-2 border-black">
                            <textarea class="w-full h-20 md:h-12 p-4 rounded-3xl outline-none resize-none bg-transparent" placeholder="Write your notes..."></textarea>
                        </div>

                    </div>

                `

                const key = `${currentYear} - ${currentMonth + 1} - ${dayNumber}`
                const saved = localStorage.getItem(key)

                const keyColor = `color - ${currentYear} - ${currentMonth + 1} - ${dayNumber}`
                const savedColor = localStorage.getItem(keyColor)

                const keyEvent = eventKey(currentYear, currentMonth, dayNumber)
                const savedEvent = localStorage.getItem(keyEvent)
                
                if(savedColor){
                    panel.style.backgroundColor = colorMap[savedColor]
                }
                else{
                    panel.style.backgroundColor = "" //reset to default
                }

                const textarea = panel.querySelector("textarea")
                textarea.value = saved || "" //load saved notes or empty. if u space " " your placeholder will be gone

                textarea.addEventListener("input", function(){
                    localStorage.setItem(key, this.value) //saved every keystroke
                    //make notes expand as texts increase
                    this.style.height = "auto"
                    this.style.height = this.scrollHeight + "px"
                })
                
                //for the color dots
                const dots = panel.querySelectorAll("[data-color]")

                dots.forEach(function(dot){
                    dot.addEventListener("click", function(){
                        const keyColor = `color - ${currentYear} - ${currentMonth + 1} - ${dayNumber}`
                        const chosenColor = this.dataset.color
                        console.log(chosenColor)

                        if(chosenColor === "default"){
                            panel.style.backgroundColor = ""
                            pill.style.backgroundColor = colorMap[chosenColor]
                            localStorage.removeItem(keyColor)
                        }
                        else{
                            panel.style.backgroundColor = colorMap[chosenColor]
                            pill.style.backgroundColor = colorMap[chosenColor]

                            //localStorage saved
                            localStorage.setItem(keyColor, chosenColor) //save
                        }
                        
                    })
                })

                // "!" Event Indicator
                const event_Indi = panel.querySelector("#event-btn")
                const eventSection = panel.querySelector("#event-section")

                event_Indi.addEventListener("click", function(){
                    const existing = panel.querySelector("#event-input")
                    if(existing) return

                    console.log("! clicked")
                    const input = document.createElement("input")
                    input.type = "number"
                    input.id = "event-input"
                    input.className = "border-2 border-black rounded-2xl text-center mt-2 mr-0 md:mr-3 w-14 md:w-12"
                    input.min = "0"
                    input.value = savedEvent || ""
                    eventSection.appendChild(input)

                    input.addEventListener("input", function(){
                        const eventCount = Number(this.value)

                        if(eventCount > 0){
                            localStorage.setItem(keyEvent, eventCount)
                            showEventIndicator(pill, eventCount)
                        }
                        else{
                            localStorage.removeItem(keyEvent)
                            showEventIndicator(pill, 0)
                        }
                    })
                })

            })

            if (dayNumber == today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()){
                pill.className = "relative md:w-24 w-10 h-8 md:h-16 rounded-full border-black border-2 md:text-xl text-sm font-semibold flex items-center justify-center mt-4 mx-auto hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer bg-green-500"
                pill.style.backgroundColor = "#22c55e"
            }
            else{
                pill.className = "relative md:w-24 w-10 h-8 md:h-16 rounded-full md:text-xl text-sm flex items-center justify-center mt-4 mx-auto hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer shadow-lg "
                pill.style.backgroundColor = colorMap["default"]
            }

            const savedPillColor = localStorage.getItem(`color - ${currentYear} - ${currentMonth + 1} - ${dayNumber}`)
            const savedEventCount = Number(localStorage.getItem(eventKey(currentYear, currentMonth, dayNumber)))

            if(savedPillColor){
                pill.style.backgroundColor = colorMap[savedPillColor]
            }

            showEventIndicator(pill, savedEventCount)
        }

        grid.appendChild(pill)
    }

    document.getElementById("month-text").textContent = monthNames[currentMonth] + " " + currentYear
}

document.getElementById("prev-btn").addEventListener("click", function(){
    currentMonth = currentMonth - 1

    if(currentMonth < 0){
        currentMonth = 11
        currentYear = currentYear - 1
    }

    renderCalendar()
})

document.getElementById("next-btn").addEventListener("click", function(){
    currentMonth = currentMonth + 1

    if(currentMonth > 11){
        currentMonth = 0
        currentYear = currentYear + 1
    }

    renderCalendar()
})

renderCalendar()
