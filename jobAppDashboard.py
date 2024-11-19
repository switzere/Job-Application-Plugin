import pandas as pd
import dash
from dash import dcc, html, dash_table
import plotly.express as px
import webview
import threading
import os
import json
import glob
from datetime import datetime, timedelta
import csv
from time import sleep
import dash_html_components as html


# Initialize the Dash app
app = dash.Dash(__name__)

csv_file_path = "job_applications.csv"

# Define the headers for the DataFrame
headers = ["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"]

# Initialize an empty DataFrame with the headers
df = pd.DataFrame(columns=headers)

def read_json_files():
    downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
    json_files = glob.glob(os.path.join(downloads_folder, "job_app_details_*.json"))
    for file in json_files:
        with open(file, 'r', encoding='utf-8') as f:
            job_details = json.load(f)
            timestamp = datetime.now().isoformat()
            with open(csv_file_path, 'a', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=["jobTitle", "companyInfo", "url", "jobDescription", "timestamp", "notes", "stage", "postingSource"])
                writer.writerow({
                    "jobTitle": job_details['jobTitle'],
                    "companyInfo": job_details['companyInfo'],
                    "url": job_details['url'],
                    "jobDescription": job_details['jobDescription'],
                    "timestamp": timestamp,
                    "notes": '',
                    "stage": 'Applied',
                    "postingSource": job_details['postingSource']
                })
        os.remove(file)

read_json_files()

# Load data from the CSV file into the DataFrame
if os.path.exists(csv_file_path):
    df = pd.read_csv(csv_file_path)

# Define the layout of the Dash app
app.layout = html.Div([
    dcc.Store(id='window-close-store'),
    dash_table.DataTable(
        id='table-editing-simple',
        columns=[
            {'name': 'jobTitle', 'id': 'jobTitle'},
            {'name': 'companyInfo', 'id': 'companyInfo'},
            {'name': 'url', 'id': 'url'},
            {'name': 'jobDescription', 'id': 'jobDescription'},
            {'name': 'timestamp', 'id': 'timestamp'},
            {'name': 'notes', 'id': 'notes'},
            {'name': 'stage', 'id': 'stage', 'presentation': 'dropdown'},
            {'name': 'postingSource', 'id': 'postingSource'}
            #{'name': 'Delete', 'id': 'delete', 'presentation': 'markdown'}
        ],
        data=df.to_dict('records'),

        editable=True,
        fixed_rows={'headers': True},
        dropdown={
            'stage': {
                'options': [
                    {'label': 'Applied', 'value': 'Applied'},
                    {'label': 'Rejected', 'value': 'Rejected'},
                    {'label': 'Interview 1', 'value': 'Interview 1'},
                    {'label': 'Interview 2', 'value': 'Interview 2'},
                    {'label': 'Ghosted', 'value': 'Ghosted'}
                ]
            }
        },
        style_cell={
            'textAlign': 'left',
            'minWidth': '100px',
            'width': '100px',
            'maxWidth': '200px'
        },
        style_table={
            'width': '100%',
            'height': '30%'
        },
        style_data_conditional=[
            {'if': {'column_id': 'jobTitle'}, 'width': '12%'},
            {'if': {'column_id': 'companyInfo'}, 'width': '12%'},
            {'if': {'column_id': 'url'}, 'width': '12%'},
            {'if': {'column_id': 'jobDescription'}, 'width': '20%'},
            {'if': {'column_id': 'timestamp'}, 'width': '12%'},
            {'if': {'column_id': 'notes'}, 'width': '12%'},
            {'if': {'column_id': 'stage'}, 'width': '10%'},
            {'if': {'column_id': 'postingSource'}, 'width': '10%'}
        ],
    ),
    html.Button('Update Jobs', id='update-jobs-button', n_clicks=0),  # Add a button to update jobs
    html.H1(id='total-applications', style={'textAlign': 'center'}),
    html.H2(id='applications-today', style={'textAlign': 'center'}),
    dcc.Graph(id='table-editing-simple-output-bar'),
    dcc.Graph(id='table-editing-simple-output-line'),
    dcc.Graph(id='table-editing-simple-output-pie')

])

# Callback to update the headers based on table data
@app.callback(
    [dash.Output('total-applications', 'children'),
     dash.Output('applications-today', 'children')],
    [dash.Input('table-editing-simple', 'data')]
)
def update_headers(rows):
    df = pd.DataFrame(rows)
    
    # Total number of job applications
    total_applications = len(df)
    
    # Number of job applications applied to today
    today = pd.to_datetime('today').normalize()
    df['timestamp'] = pd.to_datetime(df['timestamp']).dt.normalize()
    applications_today = len(df[df['timestamp'] == today])
    
    total_applications_text = f"Total Job Applications: {total_applications}"
    applications_today_text = f"Job Applications Today: {applications_today}"
    
    return total_applications_text, applications_today_text


# Callback to update the graphs based on table edits and save changes to CSV
@app.callback(
    [dash.Output('table-editing-simple-output-bar', 'figure'),
     dash.Output('table-editing-simple-output-line', 'figure'),
     dash.Output('table-editing-simple-output-pie', 'figure')],
    [dash.Input('table-editing-simple', 'data'),
     dash.Input('table-editing-simple', 'columns')]
)
def display_output(rows, columns):
    df = pd.DataFrame(rows, columns=[c['name'] for c in columns])
    
    # Save the updated DataFrame to the CSV file
    df.to_csv(csv_file_path, index=False)
    
    # Group by 'stage' and count the number of applications
    stage_counts = df['stage'].value_counts().reset_index()
    stage_counts.columns = ['stage', 'count']
    
    # Define the order of stages and colors
    stage_order = ['Applied', 'Interview 1', 'Interview 2', 'Rejected', 'Ghosted']
    stage_colors = {
        'Applied': 'blue',
        'Interview 1': 'orange',
        'Interview 2': 'green',
        'Rejected': 'red',
        'Ghosted': 'grey'
    }

    # Generate the bar chart with ordered columns and colors
    bar_fig = px.bar(
        stage_counts, 
        x='stage', 
        y='count', 
        title='Number of Applications at Each Stage',
        category_orders={'stage': stage_order},
        color='stage',
        color_discrete_map=stage_colors
    )
    
    # Generate the line chart with cumulative count of job applications over time
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    df['cumulative_count'] = df.index + 1
    line_fig = px.line(df, x='timestamp', y='cumulative_count', title='Cumulative Number of Job Applications Over Time')
    
    # Generate the pie chart showing the distribution of job applications by posting source
    pie_fig = px.pie(df, names='postingSource', title='Distribution of Job Applications by Posting Source')
    
    return bar_fig, line_fig, pie_fig


# Callback to update the table when the button is clicked
@app.callback(
    dash.Output('table-editing-simple', 'data'),
    [dash.Input('update-jobs-button', 'n_clicks')]
)
def update_jobs(n_clicks):
    if n_clicks > 0:
        read_json_files()
        if os.path.exists(csv_file_path):
            df = pd.read_csv(csv_file_path)
        return df.to_dict('records')
    return dash.no_update

# Function to run the Dash app
def run_dash():
    app.run_server(debug=True, port=8050, use_reloader=False)

# Function to create a webview window
def create_window():
    webview.create_window("Job Application Dashboard", "http://127.0.0.1:8050", maximized=True)
    webview.start()
    #window.closed += lambda window: os._exit(0)


def read_csv():
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Check if the job has been in the "Applied" stage for over 30 days
            if row["stage"] == "Applied":
                timestamp = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M:%S.%f")
                if datetime.now() - timestamp > timedelta(days=30):
                    row["stage"] = "Ghosted"
            


# Run the Dash app in a separate thread
if __name__ == '__main__':
    dash_thread = threading.Thread(target=run_dash)
    dash_thread.daemon = True
    dash_thread.start()
    create_window()