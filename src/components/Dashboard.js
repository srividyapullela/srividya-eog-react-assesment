import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import Card from "@material-ui/core/Card";
import CardHeaderRaw from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import AvatarRaw from "@material-ui/core/Avatar";
import { withScriptjs, GoogleMap, Marker, withGoogleMap, InfoWindow } from "react-google-maps"
import { compose, withProps } from "recompose"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cardStyles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "white"
  }
});
const CardHeader = withStyles(cardStyles)(CardHeaderRaw);

const avatarStyles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "white"
  }
});
const Avatar = withStyles(avatarStyles)(AvatarRaw);

const styles = {
  card: {
    margin: "5% 25%"
  }
};

const MyMapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
  )((props) => {
      const output = props.data ?
            <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: props.data[0].latitude, lng: props.data[0].longitude }}
                >
                {props.isMarkerShown && 
                    <Marker 
                        position={{ lat: props.data[0].latitude, lng: props.data[0].longitude }}
                        onClick={() => props.onMarkerClick(props.data[0].latitude,props.data[0].longitude)}>
                            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                            <div>{props.weatherInfo}</div>
                            </InfoWindow>}
                        </Marker>}
            </GoogleMap>
            :'';
      return output;
    }
  );


class DashboardVisualization extends Component {

    constructor(props) {
        super(props)

        this.state = {
            weatherInfo: '',
            isOpen: false
        }
    }

    notifyA = () => toast('some error', {containerId: 'A'});
    
    componentDidMount() {
       this.delayShowMarker();
    }

    delayShowMarker() {
        setInterval(() => {
            this.props.onLoad();
       }, 5000)
    }

    handleMarkerClick = (latitude, longitude) => {
        console.log(latitude)
        console.log(longitude)
        this.props.fetchWeather(latitude, longitude)
        this.setState({markerClicked: true});
    }

    onToggleOpen = () => {
        this.setState({weatherInfo:'', isOpen: false})
        this.setState({markerClicked: false});
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.weather)
        if(nextProps.weather && this.state.markerClicked) {
            this.setState({weatherInfo: nextProps.weather.temperatureinCelsius, isOpen:true})
        }
    }
    
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
              <CardHeader title="Dashboard Visualization" />
              <CardContent>
                  <MyMapComponent 
                      isMarkerShown
                      onMarkerClick={this.handleMarkerClick}
                      isLoading={this.props.loading}
                      data={this.props.data.data}
                      weatherInfo={this.state.weatherInfo}
                      isOpen={this.state.isOpen}
                      onToggleOpen= {this.onToggleOpen}
                  />
              }
              </CardContent>
            </Card>
        );
    }
};

const mapState = (state, ownProps) => {
    const {
      loading,
      data
    } = state.drone;
    return {
      loading,
      data,
      weather: state.weather
    };
  };
  
  const mapDispatch = dispatch => ({
    onLoad: () =>
      dispatch({
        type: actions.FETCH_DRONE_DATA
      }),
    
     fetchWeather: (latitude, longitude) => dispatch({
        type: actions.FETCH_WEATHER,
        latitude,
        longitude
      }),
      fetchWeatherById: (id) =>  dispatch({
        type: actions.WEATHER_ID_RECEIVED,
        id
      })
  })
  
  export default connect(
    mapState,
    mapDispatch
  )(withStyles(styles)(DashboardVisualization));
