// jquery 使用echart 构建 conclusion 热力图
$(document.getElementById("conclusion-echart")).ready(function () {
    console.log("conclusion-echart contruct")

    let conclusionChart = echarts.init(document.getElementById('conclusion-echart'))

    let csvData = initHeatmapData()

    // 加载 序列化后的结果文件
    //D3 异步的加载csv
    // d3.text('../data/result_top100_heatmap_normalize.csv', function (data) {
    // let csvData = d3.csv.parseRows(data)

    // 坐标轴
    // let xArray = Array.from({
    //     length: 15
    // }, (_, index) => (index + 1)).concat(
    //     Array.from({
    //         length: 10
    //     }, (_, index) => (91 + index))
    // )
    //电影1-25
    let xArray = Array.from({
        length: 25
    }, (_, index) => (index) + 1)


    // 分层抽样1，6，11...

    //let xArray = Array.from({
    //  length: 20
    //}, (_, index) => (index * 5) + 1)



    // 格式:movie_id,movie_title,score,actor_experience,director_ability,director_experience,company,genre,budget,runtime,month
    let yArray = csvData.shift().slice(2).reverse()
    // yLength 应该为9（行数）
    let yLength = yArray.length

    // 数据 9行*N列
    heatmapData = []
    movieIdData = []
    movieTitleData = []
    for (let x of xArray) {
        // line 内容是从y轴上到下, 共9个元素
        let line = csvData[x - 1]
        movieIdData.push(line[0])
        movieTitleData.push(line[1])
        for (let y = 0; y < yLength; y++) {
            // x轴坐标, y轴坐标, 数值
            heatmapData.push([xArray.indexOf(x), y, line[yLength + 1 - y]])
        }
    }

    let option = getHeatmapOption(xArray, yArray, heatmapData, movieTitleData)
    conclusionChart.setOption(option);
    // })


    // 配置热力图option
    function getHeatmapOption(xArray, yArray, heatmapData, movieTitleData) {
        let option = {
            tooltip: {
                position: 'top',
                formatter: function (obj) {
                    // 显示 电影名 + value
                    let cardValue = obj.value
                    let cardName = movieTitleData[cardValue[0]]
                    return "<div style='font-size: 18px;margin: 7px'>" + cardName + "</div>" +
                        "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgba(246,239,166,1);'></span>" +
                        "<p style='display:inline-block'>" + cardValue[2] + "</p>"
                }
            },
            animation: false,
            grid: {
                height: '65%',
                left: 120,
                y: '15%'
            },
            xAxis: {
                type: 'category',
                data: xArray,
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#aaa', '#ddd']
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: yArray,
                axisLine: {
                    lineStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ['#aaa', '#ddd']
                    }
                }
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
                textStyle: {
                    color: '#fff'
                },

                // show: false,
                inRange: {
                    color: ['#FCE4EC', '#D32F2F'],
                    // symbolSize: [50, 100]
                }
            },
            series: [{
                // name: 'Punch Card',
                type: 'heatmap',
                data: heatmapData,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        return option;
    }
});

// 将csv 写入js
function initHeatmapData() {
    let data = [
        ["movie_id", "movie_title", "score", "actor_experience", "director_ability", "director_experience", "company", "genre", "budget", "runtime", "month"],
        ["19995", "Avatar", "10", "5.22", "8.67", "10", "4", "10", "6.2", "10", "7.5"],
        ["597", "Titanic", "10", "3.44", "8.67", "10", "9.4", "9", "5.21", "5", "7.5"],
        ["24428", "The Avengers", "9.08", "10", "5.53", "4.01", "9.4", "7", "5.74", "9", "2.5"],
        ["122", "The Lord of the Rings: The Return of the King", "8.81", "1.78", "8.7", "2.53", "8.4", "9.5", "2.39", "5", "7.5"],
        ["168259", "Furious 7", "8.7", "2.79", "5.8", "2.62", "9.8", "10", "4.95", "7", "2.5"],
        ["155", "The Dark Knight", "8.43", "2.91", "9.67", "5.93", "1.4", "9", "4.81", "6", "7.5"],
        ["99861", "Avengers: Age of Ultron", "8.1", "10", "5.53", "4.01", "6.8", "10", "7.34", "9", "2.5"],
        ["121", "The Lord of the Rings: The Two Towers", "7.36", "1.78", "8.7", "2.53", "8.4", "9.5", "1.99", "5", "7.5"],
        ["109445", "Frozen", "7.31", "3.56", "4.13", "3.44", "10", "8", "3.88", "8", "7.5"],
        ["49026", "The Dark Knight Rises", "7.09", "2.91", "9.67", "5.93", "2.6", "10", "6.54", "10", "7.5"],
        ["27205", "Inception", "7.06", "3.27", "9.67", "5.93", "2.6", "10", "4.15", "6", "7.5"],
        ["120", "The Lord of the Rings: The Fellowship of the Ring", "7.03", "1.78", "8.7", "2.53", "8.4", "9.5", "2.37", "5", "7.5"],
        ["10193", "Toy Story 3", "6.98", "4.86", "4.97", "1.73", "10", "8", "5.21", "8", "10"],
        ["150540", "Inside Out", "6.95", "1.57", "6.83", "3.93", "10", "9", "4.55", "4", "10"],
        ["11", "Star Wars", "6.76", "2.32", "6.73", "2.86", "5.2", "9.5", "0.19", "2", "7.5"],
        ["8587", "The Lion King", "6.53", "2.18", "6.07", "1.96", "10", "5", "1.09", "4", "10"],
        ["13", "Forrest Gump", "6.48", "4.86", "9.9", "1.71", "9.4", "8.5", "1.36", "9", "7.5"],
        ["57158", "The Hobbit: The Desolation of Smaug", "6.34", "1.76", "8.7", "2.53", "8.4", "9.5", "6.54", "10", "7.5"],
        ["135397", "Jurassic World", "6.32", "6.03", "3.33", "2.63", "2", "10", "3.88", "2", "10"],
        ["12", "Finding Nemo", "6.23", "1.72", "6.13", "2.53", "2.8", "8", "2.39", "8", "7.5"],
        ["157336", "Interstellar", "6.16", "1.22", "9.67", "5.93", "9.4", "9.5", "4.28", "10", "7.5"],
        ["671", "Harry Potter and the Philosopher's Stone", "6.14", "4.21", "7.27", "1.45", "3.8", "9.5", "3.22", "6", "7.5"],
        ["118340", "Guardians of the Galaxy", "6.14", "6.03", "5.43", "1.14", "6.8", "10", "4.41", "2", "7.5"],
        ["329", "Jurassic Park", "6.11", "1.69", "10", "6.81", "9.8", "9.5", "1.57", "3", "10"],
        ["271110", "Captain America: Civil War", "5.99", "4.36", "4.77", "3.35", "1.6", "9.5", "6.54", "6", "2.5"],
        ["674", "Harry Potter and the Goblet of Fire", "5.66", "4.21", "5.97", "1.38", "1.2", "9.5", "3.88", "10", "7.5"],
        ["1891", "The Empire Strikes Back", "5.64", "2.32", "5.3", "0.66", "5.2", "9.5", "0.37", "2", "7.5"],
        ["673", "Harry Potter and the Prisoner of Azkaban", "5.63", "4.21", "6.83", "2.62", "3.8", "9.5", "3.35", "9", "7.5"],
        ["675", "Harry Potter and the Order of the Phoenix", "5.61", "4.21", "4.67", "1.47", "3.6", "9.5", "3.88", "7", "10"],
        ["767", "Harry Potter and the Half-Blood Prince", "5.58", "4.21", "4.67", "1.47", "3.6", "9.5", "6.54", "6", "7.5"],
        ["68721", "Iron Man 3", "5.45", "10", "4.47", "2.03", "6.8", "10", "5.21", "3", "2.5"],
        ["14160", "Up", "5.3", "1.34", "6.83", "3.93", "2.8", "8", "4.55", "4", "7.5"],
        ["672", "Harry Potter and the Chamber of Secrets", "5.24", "4.21", "7.27", "1.45", "3.8", "9.5", "2.55", "10", "7.5"],
        ["58", "Pirates of the Caribbean: Dead Man's Chest", "5.16", "4.35", "7.03", "2.28", "10", "9.5", "5.21", "6", "10"],
        ["37724", "Skyfall", "5.11", "3.18", "7.5", "2.54", "2", "10", "5.21", "9", "2.5"],
        ["177572", "Big Hero 6", "5.11", "1.8", "5.13", "1.55", "10", "9.5", "4.28", "8", "2.5"],
        ["101299", "The Hunger Games: Catching Fire", "5.07", "1.55", "6.13", "1.29", "1", "9.5", "3.35", "9", "7.5"],
        ["1892", "Return of the Jedi", "4.94", "2.32", "5.67", "0.73", "5.2", "9.5", "0.75", "3", "7.5"],
        ["745", "The Sixth Sense", "4.93", "1.22", "5.3", "0.93", "0.8", "4", "0.96", "1", "2.5"],
        ["49051", "The Hobbit: An Unexpected Journey", "4.89", "2.84", "8.7", "2.53", "8.4", "9.5", "6.54", "10", "7.5"],
        ["100402", "Captain America: The Winter Soldier", "4.88", "4.36", "4.77", "3.35", "6.8", "10", "4.41", "7", "2.5"],
        ["122917", "The Hobbit: The Battle of the Five Armies", "4.81", "1.76", "8.7", "2.53", "8.4", "10", "6.54", "9", "7.5"],
        ["127585", "X-Men: Days of Future Past", "4.77", "1.36", "7.87", "1.08", "3.6", "10", "6.54", "3", "7.5"],
        ["293660", "Deadpool", "4.68", "1.43", "4.23", "1.16", "3.6", "10", "1.44", "1", "2.5"],
        ["424", "Schindler's List", "4.65", "0.55", "10", "6.81", "9.8", "9", "0.48", "5", "7.5"],
        ["93456", "Despicable Me 2", "4.59", "2.7", "3.67", "5.46", "9.8", "8", "1.91", "8", "10"],
        ["238", "The Godfather", "4.5", "0.41", "8.6", "0.07", "9.4", "9", "0.05", "5", "2.5"],
        ["601", "E.T. the Extra-Terrestrial", "4.44", "1.45", "10", "6.81", "9.8", "7", "0.17", "1", "2.5"],
        ["857", "Saving Private Ryan", "4.4", "4.86", "10", "6.81", "9.4", "9", "1.76", "10", "7.5"],
        ["286217", "The Martian", "4.37", "3.52", "9.07", "1.77", "3.6", "9", "2.77", "9", "0"],
        ["129", "Spirited Away", "4.37", "0.47", "7.5", "0.92", "0.6", "7.5", "0.29", "2", "7.5"],
        ["10681", "WALL·E", "4.33", "0.93", "6.13", "2.53", "10", "8", "4.68", "8", "10"],
        ["603", "The Matrix", "4.29", "1.26", "6.43", "0.98", "2", "10", "1.57", "7", "2.5"],
        ["98", "Gladiator", "4.25", "0.81", "9.07", "1.77", "2.4", "10", "2.63", "6", "7.5"],
        ["82702", "How to Train Your Dragon 2", "4.25", "1.51", "5.33", "1.42", "1.4", "7.5", "3.75", "8", "10"],
        ["285", "Pirates of the Caribbean: At World's End", "4.23", "4.35", "7.03", "2.28", "10", "9.5", "7.87", "10", "7.5"],
        ["22", "Pirates of the Caribbean: The Curse of the Black Pearl", "4.22", "4.35", "7.03", "2.28", "10", "9.5", "3.62", "9", "7.5"],
        ["1895", "Star Wars: Episode III - Revenge of the Sith", "4.17", "1.55", "6.73", "2.86", "5.2", "7", "2.9", "7", "7.5"],
        ["497", "The Green Mile", "4.13", "4.86", "7.5", "0.2", "0.4", "7.5", "1.49", "5", "7.5"],
        ["105", "Back to the Future", "4.1", "0.67", "9.9", "1.71", "9.8", "9.5", "0.4", "1", "7.5"],
        ["807", "Se7en", "4.08", "1.47", "8.63", "0.92", "0.4", "5.5", "0.77", "3", "0"],
        ["2062", "Ratatouille", "4.03", "1.72", "4.77", "1.46", "10", "8", "3.88", "1", "10"],
        ["280", "Terminator 2: Judgment Day", "4.02", "0.93", "8.67", "10", "0.6", "10", "2.55", "7", "7.5"],
        ["680", "Pulp Fiction", "4.01", "0.35", "9.33", "1.51", "0.4", "6", "0.11", "6", "2.5"],
        ["49047", "Gravity", "3.98", "4.37", "6.83", "2.62", "3.6", "7", "2.69", "4", "0"],
        ["119450", "Dawn of the Planet of the Apes", "3.95", "1.29", "4.23", "1.01", "0.8", "7", "4.41", "3", "10"],
        ["211672", "Minions", "3.88", "4.37", "1.63", "3.08", "9.8", "5", "1.86", "4", "10"],
        ["106646", "The Wolf of Wall Street", "3.86", "3.27", "9.9", "0.61", "9.4", "5.5", "2.55", "5", "7.5"],
        ["4935", "Howl's Moving Castle", "3.83", "0.39", "7.5", "0.92", "0.6", "7.5", "0.53", "2", "7.5"],
        ["9806", "The Incredibles", "3.77", "1.14", "5.77", "2.77", "10", "10", "2.34", "1", "7.5"],
        ["68718", "Django Unchained", "3.76", "0.75", "9.33", "1.51", "2", "9", "2.55", "10", "7.5"],
        ["274", "The Silence of the Lambs", "3.75", "0.46", "5.17", "0.12", "0.2", "5.5", "0.4", "2", "2.5"],
        ["210577", "Gone Girl", "3.72", "0.64", "8.63", "0.92", "3.6", "4", "1.52", "9", "2.5"],
        ["585", "'Monsters", " Inc.'", "3.67", "1.54", "0", "3.93", "10", "8", "2.95", "4", "7.5"],
        ["278927", "The Jungle Book", "3.66", "1.77", "5.43", "2.71", "10", "5", "4.55", "1", "2.5"],
        ["14", "American Beauty", "3.65", "0.62", "7.5", "2.54", "2.4", "9", "0.29", "2", "0"],
        ["38757", "Tangled", "3.54", "1.63", "3.9", "1.37", "10", "8", "6.81", "8", "7.5"],
        ["207", "Dead Poets Society", "3.53", "0.39", "6.63", "0.05", "0.2", "9", "0.33", "3", "10"],
        ["278", "The Shawshank Redemption", "3.5", "0", "7.5", "0.2", "0.4", "9", "0.56", "9", "0"],
        ["1726", "Iron Man", "3.5", "10", "5.43", "2.71", "6.8", "10", "3.62", "2", "2.5"],
        ["89", "Indiana Jones and the Last Crusade", "3.44", "2.81", "10", "6.81", "5.2", "9.5", "1.17", "3", "7.5"],
        ["16869", "Inglourious Basterds", "3.42", "1.47", "9.33", "1.51", "9.8", "9", "1.76", "6", "2.5"],
        ["809", "Shrek 2", "3.38", "2.56", "4.7", "2.36", "2.4", "9.5", "3.88", "4", "7.5"],
        ["128", "Princess Mononoke", "3.38", "0.25", "7.5", "0.92", "0.4", "9.5", "0.6", "3", "7.5"],
        ["550", "Fight Club", "3.33", "0.14", "8.63", "0.92", "0", "9", "1.57", "7", "2.5"],
        ["102651", "Maleficent", "3.32", "1.38", "3.57", "1.11", "10", "7.5", "4.68", "4", "7.5"],
        ["770", "Gone with the Wind", "3.3", "0.7", "5.13", "0.38", "0.4", "9", "0", "5", "7.5"],
        ["36557", "Casino Royale", "3.28", "3.18", "5.1", "0.78", "0.8", "9.5", "3.88", "9", "7.5"],
        ["10191", "How to Train Your Dragon", "3.26", "1.51", "5", "1.07", "1.4", "7.5", "4.28", "8", "2.5"],
        ["1422", "The Departed", "3.25", "3.27", "9.9", "0.61", "0.2", "9", "2.29", "6", "2.5"],
        ["190859", "American Sniper", "3.24", "0.97", "9.67", "0.67", "2", "3", "1.46", "3", "7.5"],
        ["85", "Raiders of the Lost Ark", "3.24", "2.81", "10", "6.81", "5.2", "9.5", "0.37", "1", "10"],
        ["62211", "Monsters University", "3.23", "2.06", "2.73", "1.08", "10", "8", "5.21", "8", "10"],
        ["1865", "Pirates of the Caribbean: On Stranger Tides", "3.22", "4.35", "4.97", "1.69", "10", "9.5", "10", "7", "7.5"],
        ["205596", "The Imitation Game", "3.21", "0.39", "5.9", "0.04", "0.2", "3.5", "0.27", "1", "7.5"],
        ["177677", "Mission: Impossible - Rogue Nation", "3.17", "1.24", "3.47", "0.95", "9.4", "10", "3.88", "3", "7.5"],
        ["862", "Toy Story", "3.14", "4.86", "5", "0.33", "2.8", "8", "0.69", "4", "2.5"],
        ["581", "Dances with Wolves", "3.14", "0.35", "4", "0", "0.4", "9.5", "0.48", "5", "7.5"],
        ["578", "Jaws", "3.12", "0.84", "10", "6.81", "9.8", "6.5", "0.08", "2", "10"],
        ["137106", "The Lego Movie", "3.11", "6.03", "5.33", "1", "2", "9.5", "1.49", "8", "2.5"]
    ]

    return data
}