import tkinter as tk
import cv2
import webbrowser

class KeyboardApp:
    def __init__(self, master):
        self.master = master
        master.title("Virtual Keyboard")

        # Styling the window
        master.configure(bg="#2E4053")

        # Entry box styling
        self.text_box = tk.Entry(master, width=50, font=("Arial", 14), bg="#D5D8DC")
        self.text_box.grid(row=0, column=0, columnspan=3, padx=10, pady=10)

        # Create a frame for keyboard buttons
        self.button_frame = tk.Frame(master, bg="#2E4053")
        self.button_frame.grid(row=1, column=0, columnspan=3, padx=10, pady=10)

        self.create_keyboard_buttons()

    def create_keyboard_buttons(self):
        buttons = [
            ('Q', 0, 0), ('W', 0, 1), ('E', 0, 2), ('R', 0, 3), ('T', 0, 4),
            ('Y', 0, 5), ('U', 0, 6), ('I', 0, 7), ('O', 0, 8), ('P', 0, 9),
            ('A', 1, 0), ('S', 1, 1), ('D', 1, 2), ('F', 1, 3), ('G', 1, 4),
            ('H', 1, 5), ('J', 1, 6), ('K', 1, 7), ('L', 1, 8),
            ('Z', 2, 0), ('X', 2, 1), ('C', 2, 2), ('V', 2, 3), ('B', 2, 4),
            ('N', 2, 5), ('M', 2, 6),
            ('Space', 3, 2), ('Backspace', 3, 3),
            ('😀', 4, 4), ('😂', 4, 5), ('😊', 4, 6), ('😍', 4, 7),
            ('🥳', 4, 8), ('😎', 4, 9), ('🤩', 4, 10), ('😜', 4, 11),
            ('Game Mode 🎮', 5, 6),  # Add a button for Game Mode
            ('📷', 6, 6)  # Camera button
        ]

        for text, row, column in buttons:
            if text == '📷':
                button = tk.Button(self.button_frame, text=text, width=8, height=2, bg="#5DADE2", fg="white",
                                   font=("Arial", 12), command=self.capture_image)
            elif text == 'Game Mode 🎮':
                button = tk.Button(self.button_frame, text=text, width=12, height=2, bg="#28B463", fg="white",
                                   font=("Arial", 12, "bold"), command=self.open_game_mode)
            else:
                button = tk.Button(self.button_frame, text=text, width=8, height=2, bg="#34495E", fg="white",
                                   font=("Arial", 12), command=lambda t=text: self.on_button_click(t))
            button.grid(row=row + 1, column=column, padx=5, pady=5)

    def on_button_click(self, text):
        current_text = self.text_box.get()
        if text == "Backspace":
            self.text_box.delete(len(current_text) - 1, tk.END)
        elif text == "Space":
            self.text_box.insert(tk.END, " ")
        else:
            self.text_box.insert(tk.END, text)

    def capture_image(self):
        # Open the camera
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame")
                break

            cv2.imshow('Press "C" to capture', frame)

            key = cv2.waitKey(1)
            if key == ord('c'):
                cv2.imwrite('captured_photo.jpg', frame)
                cv2.imshow('Captured Photo', frame)
                break

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

    def open_game_mode(self):
        webbrowser.open_new('http://127.0.0.1:5500/homePage.html')  # Open the game in a web browser


if __name__ == "__main__":
    root = tk.Tk()
    app = KeyboardApp(root)
    root.mainloop()