defmodule TimeTracker.WorkingTimeContext do
  @moduledoc """
  The WorkingTimeContext context.
  """

  import Ecto.Query, warn: false
  alias TimeTracker.Repo

  alias TimeTracker.WorkingTimeContext.WorkingTime

  @doc """
  Returns the list of working_times.

  ## Examples

      iex> list_working_times()
      [%WorkingTime{}, ...]

  """
  # def list_working_times(params) do
  #   filter_start =
  #     if params["start"] do
  #       dynamic([p], p.start >= ^params["start"])
  #     else
  #       true
  #     end

  #   filter_end =
  #     if params["end"] do
  #       dynamic([p], p.end <= ^params["end"])
  #     else
  #       true
  #     end

  #   query =
  #     from WorkingTime,
  #       where: ^filter_start,
  #       where: ^filter_end

  #   Repo.all(query)
  # end

  def list_working_times(params, user_id) do
    filter_start =
      if params["start"] do
        dynamic([p], p.start >= ^params["start"])
      else
        true
      end

    filter_end =
      if params["end"] do
        dynamic([p], p.end <= ^params["end"])
      else
        true
      end

    query =
      from w in WorkingTime,
        where: w.user_id == ^user_id,
        where: ^filter_start,
        where: ^filter_end

    Repo.all(query)
  end


  def list_working_times_for_user(user_id) do
    query = from(w in WorkingTime, where: w.user_id == ^user_id)
    Repo.all(query)
  end

  @doc """
  Gets a single working_time.

  Raises `Ecto.NoResultsError` if the Working time does not exist.

  ## Examples

      iex> get_working_time!(123)
      %WorkingTime{}

      iex> get_working_time!(456)
      ** (Ecto.NoResultsError)

  """
  def get_working_time(id), do: Repo.get(WorkingTime, id)

  def get_working_time_for_user(user_id, working_time_id) do
    Repo.get_by(WorkingTime, id: working_time_id, user_id: user_id)
  end

  @doc """
  Creates a working_time.

  ## Examples

      iex> create_working_time(%{field: value})
      {:ok, %WorkingTime{}}

      iex> create_working_time(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_working_time(attrs \\ %{}) do
    %WorkingTime{}
    |> WorkingTime.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a working_time.

  ## Examples

      iex> update_working_time(working_time, %{field: new_value})
      {:ok, %WorkingTime{}}

      iex> update_working_time(working_time, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_working_time(%WorkingTime{} = working_time, attrs) do
    working_time
    |> WorkingTime.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a working_time.

  ## Examples

      iex> delete_working_time(working_time)
      {:ok, %WorkingTime{}}

      iex> delete_working_time(working_time)
      {:error, %Ecto.Changeset{}}

  """
  def delete_working_time(%WorkingTime{} = working_time) do
    Repo.delete(working_time)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking working_time changes.

  ## Examples

      iex> change_working_time(working_time)
      %Ecto.Changeset{data: %WorkingTime{}}

  """
  def change_working_time(%WorkingTime{} = working_time, attrs \\ %{}) do
    WorkingTime.changeset(working_time, attrs)
  end
end
