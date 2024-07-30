
    function alertMess(text, sic, type) {
      if (type == 'success') {
        $('body').append(
          `<div role="dialog" tabindex="0" class="msg van-popup van-popup--center van-toast van-toast--middle van-toast--success" style="z-index: 2001; display:ne;"><i class="van-badge__wrapper van-icon van-icon-success van-toast__icon"><!----><!----><!----></i><div class="van-toast__text">${text}</div><!----></div>`
        );
      } else {
        $('body').append(
          `<div role="dialog" tabindex="0" class="msg van-popup van-popup--center van-toast van-toast--middle van-toast--success" style="z-index: 2001; display:ne;"><i class="van-badge__wrapper van-icon van-icon-fail van-toast__icon"><!----><!----><!----></i><div class="van-toast__text">${text}</div><!----></div>`
        );
      }
      setTimeout(() => {
        $('.msg').removeClass('v-enter-active v-enter-to');
        $('.msg').addClass('v-leave-active v-leave-to');
        setTimeout(() => {
          $('.msg').remove();
        }, 100);
        sic.removeClass('block-click');
      }, 1000);
    }
    var drawLine = () => {
    
        const container = document.getElementById("trend_container");
        const canvas = document.getElementById("line_canvas");
        const ctx = canvas.getContext("2d");

        function adjustCanvasSize() {
          canvas.width = container.offsetWidth;
          canvas.height = container.offsetHeight;
        }

        function getActiveElements() {
          return Array.from(document.querySelectorAll(".trend .active"));
        }

        function drawLines() {
          const activeElements = getActiveElements();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();

          activeElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const x =
              rect.left +
              rect.width / 2 -
              container.getBoundingClientRect().left;
            const y =
              rect.top +
              rect.height / 2 -
              container.getBoundingClientRect().top;

            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });

          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        adjustCanvasSize();
        drawLines();

        window.addEventListener("resize", () => {
          adjustCanvasSize();
          drawLines();
        });
    }
    
    $(document).ready(function () {
        fetchTrend()
    });
    
    var fetchTrend = () => {
        $.ajax({
            type: "POST",
            url: "/api/webapi/GetNoaverageEmerdList",
              data: {
                typeid: "1",
                pageno: "0",
                pageto: "10",
                language: "vi",
              },
            dataType: "json",
            success: function (response) {
                loadTrend(response.data.gameslist)
            }
        });
    }
    
    var loadTrend = (data, realtime = true) => {
        let balls = [
            'n0-30bd92d1.png',
            'n1-dfccbff5.png',
            'n2-c2913607.png',
            'n3-f92c313f.png',
            'n4-cb84933b.png',
            'n5-49d0e9c5.png',
            'n6-a56e0b9a.png',
            'n7-5961a17f.png',
            'n8-d4d951a4.png',
            'n9-a20f6f42.png'
        ]
        if(realtime){
            let html = '';
            let ball_html = '';
            data.forEach((element , i ) => {
            let num = element.amount
            
            let size = element.amount > 4 ? 'B' : 'S';
            
            if(i < 5){
                ball_html += `<img src="/assets/png/${balls[element.amount]}" alt="">`
            }
            
            
            html += `<div data-v-d79474c9="" class="trend" issuenumber="${element.period}" number="8" colour="red" rowid="0">
                    <div data-v-d79474c9="" class="van-row">
                      <div data-v-d79474c9="" class="van-col van-col--8">
                        <div data-v-d79474c9="" class="Trend__C-body2-IssueNumber">${element.period}</div>
                      </div>
                      <div data-v-d79474c9="" class="van-col van-col--16">
                        <div data-v-d79474c9="" class="Trend__C-body2-Num"><canvas data-v-d79474c9="" canvas=""
                            id="myCanvas0" class="line-canvas"></canvas>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 0 ? 'active action0' : ''}">0</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 1 ? 'active action1' : ''}">1</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 2 ? 'active action2' : ''}">2</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 3 ? 'active action3' : ''}">3</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 4 ? 'active action4' : ''}">4</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 5 ? 'active action5' : ''}">5</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 6 ? 'active action6' : ''}">6</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 7 ? 'active action7' : ''}">7</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 8 ? 'active action8' : ''}">8</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 9 ? 'active action9' : ''}">9</div>
                          <div data-v-d79474c9="" class="Trend__C-body2-Num-BS is${size}">${size}</div>
                        </div>
                      </div>
                    </div>
                  </div>`;
            });
             $('.wingo-change-time-img').html(ball_html);
            $('.Trend__C-body2').html(html)
            
        }else{
            let html = '';
            let ball_html = '';
            data.forEach(element => {
                let num = element.amount
                ball_html += `<img src="/assets/png/${balls[element.amount]}" alt="">`
                let size = element.amount > 4 ? 'B' : 'S';
                
                
                html += `<div data-v-d79474c9="" class="trend" issuenumber="${element.period}" number="8" colour="red" rowid="0">
                            <div data-v-d79474c9="" class="van-row">
                              <div data-v-d79474c9="" class="van-col van-col--8">
                                <div data-v-d79474c9="" class="Trend__C-body2-IssueNumber">${element.period}</div>
                              </div>
                              <div data-v-d79474c9="" class="van-col van-col--16">
                                <div data-v-d79474c9="" class="Trend__C-body2-Num"><canvas data-v-d79474c9="" canvas=""
                                    id="myCanvas0" class="line-canvas"></canvas>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 0 ? 'active action0' : ''}">0</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 1 ? 'active action1' : ''}">1</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 2 ? 'active action2' : ''}">2</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 3 ? 'active action3' : ''}">3</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 4 ? 'active action4' : ''}">4</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 5 ? 'active action5' : ''}">5</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 6 ? 'active action6' : ''}">6</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 7 ? 'active action7' : ''}">7</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 8 ? 'active action8' : ''}">8</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-item ${num == 9 ? 'active action9' : ''}">9</div>
                                  <div data-v-d79474c9="" class="Trend__C-body2-Num-BS is${size}">${size}</div>
                                </div>
                              </div>
                            </div>
                          </div>`;
            });
            $('.Trend__C-body2').prepend(html);
            $('.Trend__C-body2').children(':last-child').remove();
            
            $('.wingo-change-time-img').prepend(ball_html);
            $('.wingo-change-time-img').children(':last-child').remove();
        }
        drawLine()
    }
    
    
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the element that closes the modal
    var closeBtn = document.querySelector(".close-btn");



    // When the user clicks on the close button, close the modal
    closeBtn.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, also close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }