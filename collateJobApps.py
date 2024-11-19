import tkinter as tk
from tkinter import ttk, messagebox
import os
import json
import glob
import csv
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from collections import Counter

# Initialize the main window
root = tk.Tk()
root.title("Job Application Tracker")
root.geometry("800x600")  # Set the window size

# Define the path to the CSV file
csv_file_path = "job_applications.csv"

def import_json_files():
    downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
    json_files = glob.glob(os.path.join(downloads_folder, "job_app_details_*.json"))
    for file in json_files:
        with open(file, 'r', encoding='utf-8') as f:
            job_details = json.load(f)
            add_job(
                job_details['jobTitle'],
                job_details['companyInfo'],
                job_details['url'],
                job_details['jobDescription'],
                job_details.get('notes', ''),
                job_details.get('stage', 'Applied'),
                job_details['postingSource']
            )
        os.remove(file)

def add_job(job_title, company_info, url, job_description, notes, stage, postingSource):
    timestamp = datetime.now().isoformat()
    with open(csv_file_path, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"])
        writer.writerow({
            "jobTitle": job_title,
            "companyInfo": company_info,
            "url": url,
            "jobDescription": job_description,
            "timestamp": timestamp,
            "notes": notes,
            "stage": stage,
            "postingSource": postingSource
        })
    load_jobs()

# Function to load job applications from the CSV file
def load_jobs():
    for row in job_list.get_children():
        job_list.delete(row)
    updated_rows = []
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Check if the job has been in the "Applied" stage for over 30 days
            if row["stage"] == "Applied":
                timestamp = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M:%S.%f")
                if datetime.now() - timestamp > timedelta(days=30):
                    row["stage"] = "Ghosted"
            updated_rows.append(row)
            job_list.insert("", "end", values=(row["jobTitle"], row["companyInfo"], row["url"], row["jobDescription"], row["timestamp"], row["notes"], row["stage"], row["postingSource"]))
    
    # Write the updated rows back to the CSV file
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"])
        writer.writeheader()
        writer.writerows(updated_rows)
    
    update_graphs()

# Function to add a note to a job application
def add_note_to_job():
    selected_item = job_list.selection()
    if not selected_item:
        messagebox.showwarning("Warning", "Please select a job application to add a note.")
        return
    timestamp = job_list.item(selected_item, 'values')[4]  # Get the timestamp of the selected item
    note = note_entry.get()
    updated_rows = []
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['timestamp'] == timestamp:
                row['notes'] = note
            updated_rows.append(row)
    
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"])
        writer.writeheader()
        writer.writerows(updated_rows)
    load_jobs()

# Function to update the stage of a job application
def update_stage():
    selected_item = job_list.selection()
    if not selected_item:
        messagebox.showwarning("Warning", "Please select a job application to update the stage.")
        return
    timestamp = job_list.item(selected_item, 'values')[4]  # Get the timestamp of the selected item
    stage = stage_combobox_update.get()
    updated_rows = []
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['timestamp'] == timestamp:
                row['stage'] = stage
            updated_rows.append(row)
    
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"])   
        writer.writeheader()
        writer.writerows(updated_rows)
    load_jobs()

# Function to update and display the graphs
def update_graphs():
    stages = ["Applied", "Rejected", "Interview 1", "Interview 2", "Ghosted"]
    stage_counts = {stage: 0 for stage in stages}
    date_counts = Counter()
    posting_source_counts = Counter()
    
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row["stage"] in stage_counts:
                stage_counts[row["stage"]] += 1
            date = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M:%S.%f").date()
            date_counts[date] += 1
            posting_source_counts[row["postingSource"]] += 1
    
    # Update stage graph
    fig_stage.clear()
    ax_stage = fig_stage.add_subplot(111)
    ax_stage.bar(stage_counts.keys(), stage_counts.values(), color='skyblue')
    ax_stage.set_xlabel('Stages')
    ax_stage.set_ylabel('Number of Applications')
    ax_stage.set_title('Job Applications by Stage')
    canvas_stage.draw()
    
    # Update date graph
    fig_date.clear()
    ax_date = fig_date.add_subplot(111)
    dates = sorted(date_counts.keys())
    counts = [date_counts[date] for date in dates]
    ax_date.plot(dates, counts, marker='o', color='green')
    ax_date.set_xlabel('Date')
    ax_date.set_ylabel('Number of Applications')
    ax_date.set_title('Job Applications by Date')
    canvas_date.draw()

    # Update posting source pie chart
    fig_posting_source.clear()
    ax_posting_source = fig_posting_source.add_subplot(111)
    ax_posting_source.pie(posting_source_counts.values(), labels=posting_source_counts.keys(), autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99','#ffcc99'])
    ax_posting_source.set_title('Job Applications by Posting Source')
    canvas_posting_source.draw()

# Function to update the job list and graphs
def update_all():
    import_json_files()
    load_jobs()

# Create and place the job list
columns = ("jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource")
job_list = ttk.Treeview(root, columns=columns, show="headings")
for col in columns:
    job_list.heading(col, text=col)
job_list.grid(row=0, column=0, columnspan=3, sticky="nsew")

# Create and place the note entry
note_frame = ttk.Frame(root, padding="10")
note_frame.grid(row=1, column=0, columnspan=3, sticky="ew")
ttk.Label(note_frame, text="Add Note:").grid(row=0, column=0, sticky="w")
note_entry = ttk.Entry(note_frame, width=50)
note_entry.grid(row=0, column=1, sticky="ew")
ttk.Button(note_frame, text="Add Note", command=add_note_to_job).grid(row=0, column=2, sticky="e")

# Create and place the stage entry
stage_frame = ttk.Frame(root, padding="10")
stage_frame.grid(row=2, column=0, columnspan=3, sticky="ew")
ttk.Label(stage_frame, text="Update Stage:").grid(row=0, column=0, sticky="w")
stage_combobox_update = ttk.Combobox(stage_frame, values=["Applied", "Rejected", "Interview 1", "Interview 2", "Ghosted"])
stage_combobox_update.grid(row=0, column=1, sticky="ew")
stage_combobox_update.set("Applied")  # Set default value
ttk.Button(stage_frame, text="Update Stage", command=update_stage).grid(row=0, column=2, sticky="e")

# Create and place the update button
ttk.Button(root, text="Update", command=update_all).grid(row=3, column=0, columnspan=3, pady=10)

# Create matplotlib figures and embed them in the Tkinter window
fig_stage = plt.Figure(figsize=(5, 4), dpi=100)
canvas_stage = FigureCanvasTkAgg(fig_stage, master=root)
canvas_stage.get_tk_widget().grid(row=4, column=0, sticky="nsew")

fig_date = plt.Figure(figsize=(5, 4), dpi=100)
canvas_date = FigureCanvasTkAgg(fig_date, master=root)
canvas_date.get_tk_widget().grid(row=4, column=1, sticky="nsew")

fig_posting_source = plt.Figure(figsize=(5, 4), dpi=100)
canvas_posting_source = FigureCanvasTkAgg(fig_posting_source, master=root)
canvas_posting_source.get_tk_widget().grid(row=4, column=2, sticky="nsew")

# Configure the grid to expand with the window size
root.grid_rowconfigure(0, weight=1)
root.grid_rowconfigure(4, weight=1)
root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)
root.grid_columnconfigure(2, weight=1)

# import any new jobs
import_json_files()

# Load the job applications into the list
load_jobs()

# Start the main event loop
root.mainloop()