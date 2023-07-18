import React, { useState } from "react";
import axios from "axios";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomCode: "",
    roomName: "",
    photos: [],
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:2003/api/room/load");
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createRoom = async () => {
    try {
      const formData = new FormData();
      formData.append("roomCode", newRoom.roomCode);
      formData.append("roomName", newRoom.roomName);
      for (let i = 0; i < newPhotos.length; i++) {
        formData.append("photos", newPhotos[i]);
      }

      await axios.post("http://localhost:2003/api/room/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewRoom({
        roomCode: "",
        roomName: "",
        photos: [],
      });
      setNewPhotos([]);
      setPreviewImages([]);

      fetchRooms();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setNewRoom({ ...newRoom, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const images = Array.from(files);

    setNewPhotos(images);

    const imagePreviews = images.map((image) => URL.createObjectURL(image));
    setPreviewImages(imagePreviews);
  };

  return (
    <div>
      <h1>Room List</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <h2>{room.roomName}</h2>
            <button onClick={() => fetchRoomPhotos(room.id)}>View Photos</button>
          </li>
        ))}
      </ul>
      <h2>Create New Room</h2>
      <input
        type="text"
        name="roomCode"
        value={newRoom.roomCode}
        onChange={handleInputChange}
        placeholder="Room Code"
      />
      <input
        type="text"
        name="roomName"
        value={newRoom.roomName}
        onChange={handleInputChange}
        placeholder="Room Name"
      />
      <input type="file" name="photos" multiple onChange={handleFileChange} />
      <div>
        {previewImages &&
          previewImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Photo ${index}`}
              style={{ width: "200px", height: "auto" }}
            />
          ))}
      </div>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default RoomList;
