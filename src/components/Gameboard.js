import React from 'react';
import '../css/Gameboard.css';


function Gameboard({ board, shakeRow }) {
    return (
        <div className="game-board" role="tab">
            <div id="board">
                {
                    board.map((row, idx_r) => (
                        <div className={"row-b " + (idx_r == shakeRow ? 'shake' : '')} key={idx_r}>
                            {
                                row.map(t => (
                                    <div className={'flip-card tile ' + t.flip} key={t.key} >
                                        <div className="flip-card-inner">
                                            <div className={'tile flip-card-front ' + ((t.state != 'selected' && t.state != 'empty') ? 'selected' : t.state)}>
                                                {t.ch}
                                            </div>
                                            <div className={'tile flip-card-back ' + t.state}>
                                                {t.ch}
                                            </div>
                                        </div>
                                    </div>

                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Gameboard;
