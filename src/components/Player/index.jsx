import React, { Component } from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'
import ReactPlayer from 'react-player'
import ReactDragList from 'react-drag-list'
import Progress from 'react-progressbar'
import Slider, { Range } from 'rc-slider'

//service
import { 
    firebase,
    createRoom,
    deleteRoom,
    joinedRoom,
    addToList,
    getList,
    updateList,
    isUpdated,
    setPlayerVolume,
    setPlayerState,
    setPlayerProgress
 } from '../../services/my-service'
import { search } from '../../services/youtube-service'

const Background = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    padding: 15px 0;
`;

const Header = styled.div`
    h3 {
        color: #fff;
    }
`;

const Search = styled.div`
    display: flex;

    input {
        padding: 5px 10px;
        min-width: 300px;
        color: #fff;
        background-color: #000;
        border: 1px solid #fff;
        // border-bottom: 1px solid #fff;
        // border-left: 1px solid #fff;
        // border-right: none;
    }

    button {
        background: none;
        color: #fff;
        /* margin-left: 5px; */
        min-width: 100px;
        border: 1px solid;
    }
`;

const ListHolder = styled.div`
    position: absolute;
    top: 425px;
    left: 198px;

    width: 115px;
    height: 900px;

    overflow-y: auto;
    overflow-x: hidden;
    transform: rotate(-90deg) translateY(-80px);
    transform-origin: right top;

    &::-webkit-scrollbar {
        width: 1em;
    }
     
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }
     
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      outline: 1px solid slategrey;
    }

    &.isMember {
        top: 50px;
    }
`;

const List = styled.ul`
    display: flex;
    width: 100px;
    height: 100px;

    padding-left: 100px;

    list-style: none;
    transform: rotate(90deg);
    transform-origin: right top;

    li {
        position: relative;
        margin-right: 15px;
        color: #fff;

        span {
            position: absolute;
            top: 30px;
            left: 45px;

            height: 30px;
            width: 30px;

            padding: 15px;

            border: 1px solid #fff;
            border-radius: 50%;
            font-size: 50px;

            cursor: pointer;
            transition: all 0.2s ease-in-out;

            &::before {
                content: '+';
                position: absolute;
                left: 7px;
                top: -9px;

                color: #fff;
                font-size: 30px;

                transition: all 0.2s ease-in-out;
            }

            &:hover {
                border: 1px solid mediumspringgreen;
                &::before {
                    color: mediumspringgreen;
                }
            }
        }
    }
`;

const YoutubeHolder = styled.div`
    padding-top: 15px;
`;

const QueueList = styled.div`
    margin-top: 120px;
`;

const QueueItems = styled.ul`
    list-style: none;

    rc-draggable-list-handles { display: none; }

    li {
        position: relative;
        margin-bottom: 15px;
        padding: 0 65px;
        min-width: 500px;
        border-bottom: 0.05em solid #2b2b2b;

        .next {
            position: absolute;
            top: -1px;
            left: 0;
            cursor: pointer;

            &:before {
                content: 'Play';
                padding: 3px 16px;
                font-size: 10px;
                border: 1px solid #fff;
                transition: all 0.2s ease-in-out;
            }

            &.playing {
                &:before {
                    content: 'Playing';
                    padding: 3px 7px;
                    border: 1px solid mediumspringgreen;
                }
                &:hover {
                    &:before {
                        content: 'Pause';
                        padding: 3px 12px;
                    }
                }
            }

            &:hover {
                &:before {
                    color: mediumspringgreen;
                    border: 1px solid mediumspringgreen;
                }
            }
        }

        &.playing {
            color: mediumspringgreen;
        }

        .remove {
            position: absolute;
            top: -2px;
            right: 0;
            cursor: pointer;

            &:before {
                content: 'X';
                padding: 3px 7px;
                font-size: 10px;
                // border: 1px solid #fff;
                transition: all 0.2s ease-in-out;
            }

            &:hover {
                &:before {
                    color: orangered;
                    // border: 1px solid gold;
                }
            }
        }
    }
`;

const PlayerController = styled.div`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 75px;
    background-color: #000;

    .progressbar-container {
        width: 100%;
        background-color: rgba(128, 128, 128, 0.14901960784313725);
        height: 3px !important;
        .progressbar-progress {
            background-color: mediumspringgreen !important;
            height: 3px !important;
        }
    }

    .controllers {
        text-align: center;
        padding: 15px 0;

        .volume-slider {
            .rc-slider {
                position: absolute;
                left: 0;
                right: 275px;
                bottom: 30px;

                margin: 0 auto;
                width: 100px;

                .rc-slider-rail { background-color: #141414; }

                .rc-slider-track { background-color: mediumspringgreen; }

                .rc-slider-handle {
                    margin-left: -1px;
                    margin-top: -3px;
                    width: 10px;
                    height: 10px;
                    border: none;
                }
            }
        }

        span {
            margin: 0 15px;
            font-size: 30px;

            color: #fff;
            cursor: pointer;

            transition: all 0.2s ease-in-out;

            &:hover {
                color: mediumspringgreen;
            }
        }
    }

`;

export default class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            items: [],
            hasQueued: false,
            queuedItems: [],
            qSource: [],
            qCount: 0,
            videoLink: 'https://www.youtube.com/embed/5LedIInyESo',
            play: false,
            update: false,
            progress: 0,
            playerVolume: 100,
            sliderVolume: 100
        };

        window.addEventListener("onclose", (ev) => {  
            ev.preventDefault();
            deleteRoom();
            localStorage.clear();
            return;
        });
    }

    componentDidMount() {
        const player = YouTube.propTypes;
        joinedRoom((err, data) => console.log(data));
        this.handleSearch();
        this.loadPlaylist();
        this.getVolume();
        this.getPlayerState();
        this.getProgress();
    }

    loadPlaylist() {
        firebase.database().ref(`playlist/${localStorage.getItem('room')}`).on('value', async (snap) => {
            if (snap.val()) {
                const data = Object.values(snap.val());
                this.setState({
                    queuedItems: data, 
                    qSource: data, 
                    hasQueued: true, 
                    qCount: data.length, 
                    update: false
                });
                this.setState({
                    videoLink: `https://www.youtube.com/embed/${this.state.queuedItems[0].id.videoId}`,
                    play: true
                });
                isUpdated().then(updated => {
                    
                    // console.log(updated)
                    // if (updated) {
                    //     console.log(1)
                        
                    // } else {
                    //     console.log(2)
                    //     this.setState({
                    //         queuedItems: data, 
                    //         qSource: data, 
                    //         hasQueued: true, 
                    //         qCount: data.length, 
                    //         update: false
                    //     });
                    // }
                });
            }
        }, err => console.log(err));
    }

    /**************************************************************/

    handleSearchText(e) {
        this.setState({query: e.target.value});
    }

    handleSearch() {
        search(this.state.query, (err, data) => {
            if (data) {
                this.setState({items: data})
            } else {
                console.log(err)
            }
        });
    }

    handleAddToList(data, index) {
        this.state.items.splice(index, 1);
        this.state.queuedItems.push(data)
        this.setState({
            hasQueued: true,
            qCount: ++this.state.qCount
        });
        addToList(this.state.queuedItems).then(res => {
            if (this.state.qCount === 1) {
                this.setState({
                    videoLink: `https://www.youtube.com/embed/${data.id.videoId}`,
                    play: true
                });
            }
        });
    }

    handlePlay(index) {
        const tempData = this.state.queuedItems[index];
        this.state.queuedItems.splice(index, 1);
        this.state.queuedItems.unshift(tempData);
        this.setState({
            videoLink: `https://www.youtube.com/embed/${tempData.id.videoId}`,
            play: true
        });
        addToList(this.state.queuedItems);
    }

    handleRemoveQ(index) {
        this.state.queuedItems.splice(index, 1);
        this.setState({qCount: ++this.state.qCount});
        console.log(this.state.queuedItems)
        addToList(this.state.queuedItems);
    }

    updateList(e) {
        const oldIndex = e.oldIndex;
        const newIndex = e.newIndex;
        const queuedItems = this.state.queuedItems;
        this.state.queuedItems.splice((newIndex < 0 ? queuedItems.length + newIndex : newIndex), 0, queuedItems.splice(oldIndex, 1)[0]);
        updateList(this.state.queuedItems, 1);
    }

    /*
     * Player State
     */
    getPlayerState() {
        firebase.database().ref(`player/${localStorage.getItem('room')}/state`).on('value', snap => {
            this.setState({play: snap.val()});
        }, err => console.log(err));
    }

    /*
     * Player Volume
     */

    getVolume() {
        firebase.database().ref(`player/${localStorage.getItem('room')}/volume`).on('value', snap => {
            console.log(snap.val())
            this.setState({playerVolume: snap.val() / 100, sliderVolume: snap.val()});
            console.log(this.state.playerVolume, this.state.sliderVolume)
        }, err => console.log(err));
    }

    /*
     * Player Progress
     */
    playerProgress(seconds) {
        if (this.state.play) {
            setPlayerProgress(seconds.played);
            if (seconds.played === seconds.loaded) {
                this.state.queuedItems.splice(0, 1);
                this.setState({qCount: --this.state.qCount});
                addToList(this.state.queuedItems);
                if (this.state.qCount !== 0) {
                    this.setState({
                        videoLink: `https://www.youtube.com/embed/${this.state.queuedItems[0].id.videoId}`,
                        play: true
                    });
                } else {
                    this.setState({progress: 0, play: false});
                }
                addToList(this.state.queuedItems);
            }
        }
    }

    /*
     * Play Next
     */
     handlePlayNextQ() {
         if (this.state.queuedItems.length > 1) {
             const tempItems = this.state.queuedItems.splice(0, 1);
             this.setState({queuedItems: tempItems});
             updateList(this.state.queuedItems, 0);
             this.handlePlay(0);
         }
     }

    getProgress() {
        firebase.database().ref(`player/${localStorage.getItem('room')}/progress`).on('value', snap => {
            this.setState({progress: snap.val()});
        }, err => console.log(err));
    }

    handleVolume = (volume) => setPlayerVolume(volume);

    render() {
        const qItems = this.state.queuedItems;
        const qCount = this.state.qCount;
        const member = localStorage.getItem('member');

        return (
            <Background>
                <Search>
                    <input type="text" placeholder="Search" onKeyPress={this.handleSearch.bind(this)} onChange={this.handleSearchText.bind(this)}/>
                    {/* <button onClick={this.handleSearch.bind(this)}>Search</button> */}
                </Search>
                {
                    !member && 
                    <YoutubeHolder>
                        <ReactPlayer
                            url={this.state.videoLink}
                            playing={this.state.play}
                            volume={this.state.playerVolume}
                            onProgress={this.playerProgress.bind(this)}
                            onPlay={() => setPlayerState(true)}
                            onPause={() => setPlayerState(false)}
                            config={{
                                youtube: {
                                playerVars: { showinfo: 1 }
                                }
                            }}
                        />
                    </YoutubeHolder>
                }
                <ListHolder className={member ? "isMember" : ""}>
                    <List>
                        {
                            this.state.items.map((data, index) => {
                                return <li key={index}>
                                            <img src={data.snippet.thumbnails.default.url} alt={data.snippet.title} title={data.snippet.title} />
                                            <span onClick={() => this.handleAddToList(data, index)} data-id={data.id.videoId} title={"Add to Queue - " + data.snippet.title}></span>
                                        </li>;
                            })
                        }
                    </List>
                </ListHolder>
                <QueueList>
                    <QueueItems>
                        <ReactDragList
                            dataSource={this.state.qSource}
                            handles={false}
                            row={
                                (data, index) =>  <li className={(index === 0 && this.state.play) ? "playing" : ""}>
                                                        <p>{data.snippet.title}</p>
                                                        <span className={(index === 0 && this.state.play) ? "next playing" : "next"} onClick={() => this.state.play ? setPlayerState(false) : member ? setPlayerState(true) : this.handlePlay(index)}></span>
                                                        <span className="remove" onClick={() => this.handleRemoveQ(index)}></span>
                                                    </li>
                                }
                            onUpdate={this.updateList.bind(this)}
                        />
                        {/* <DraggableList
                            itemKey="name"
                            template={(data, index) => {
                                    <li key={index} className={(index === 0 && this.state.play) ? "playing" : ""}>
                                        <p>{data[index].snippet.title}</p>
                                        <span className={(index === 0 && this.state.play) ? "next playing" : "next"} onClick={() => this.handlePlay(index)}></span>
                                        <span className="remove" onClick={() => this.handleRemoveQ(index)}></span>
                                    </li>
                                }
                            }
                            list={this.state.queuedItems}
                            onMoveEnd={this.updateList.bind(this)}
                            // container={()=>useContainer ? this._container : document.body}
                        /> */}
                    </QueueItems>
                </QueueList>
                <PlayerController>
                    <Progress completed={this.state.progress * 100} />
                    <div className="controllers">
                        <div className="volume-slider">
                            <Slider min={0} max={100} 
                                    defaultValue={this.state.sliderVolume}
                                    value={this.state.sliderVolume}
                                    onAfterChange={this.handleVolume.bind(this)}
                                    onChange={this.handleVolume.bind(this)} />
                        </div>
                        {
                            this.state.play &&
                            <span className="play-btn" onClick={() => setPlayerState(false)}>
                                <i className="fas fa-pause"></i>
                            </span>
                        }
                        {
                            !this.state.play && 
                            <span className="play-btn" onClick={() => setPlayerState(true)}>
                                <i className="fas fa-play"></i>
                            </span>
                        }
                        <span className="next-btn" onClick={() => this.handlePlayNextQ()}>
                            <i className="fas fa-forward"></i>
                        </span>
                    </div>
                </PlayerController>
            </Background>
        )
    }
}
